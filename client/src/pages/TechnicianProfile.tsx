import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Wrench, Shield, CheckCircle, Clock, ArrowLeft } from 'lucide-react';

export function TechnicianProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tech, setTech] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookingStatus, setBookingStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchTech = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/technicians/${id}`);
        const data = await res.json();
        if (data.success) {
          setTech(data.technician);
        }
      } catch {
        console.error('Network error');
      } finally {
        setLoading(false);
      }
    };
    fetchTech();
  }, [id]);

  const handleBook = async () => {
    if (!user) return navigate('/login');
    setBookingStatus('Booking...');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/bookings/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerEmail: user.email,
          customerName: user.name,
          technicianEmail: tech.email,
          technicianName: tech.name,
          skill: tech.skill || 'General Repair',
          cost: 'To be quoted',
          distance: 'Nearby'
        })
      });
      const data = await res.json();
      if (data.success) {
        setBookingStatus('Confirmed!');
        alert(`Booking Confirmed! ID: ${data.bookingId}`);
        navigate('/customer/dashboard');
      } else {
        alert('Failed: ' + data.message);
        setBookingStatus(null);
      }
    } catch {
      alert('Error booking.');
      setBookingStatus(null);
    }
  };

  if (loading) return <div className="py-20 text-center text-gray-500">Loading profile...</div>;
  if (!tech) return <div className="py-20 text-center text-gray-500">Technician not found.</div>;

  const getAvatar = (t: any) => t.avatar && t.avatar.startsWith('http') ? t.avatar : `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=111827&color=fff&size=200`;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to technicians
      </button>

      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-12">
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <img src={getAvatar(tech)} alt={tech.name} className="w-32 h-32 rounded-3xl object-cover shadow-sm mb-6" />
          <h1 className="text-3xl font-bold text-gray-900">{tech.name}</h1>
          <div className="flex items-center gap-2 mt-2 text-gray-600">
            <MapPin className="w-4 h-4" /> {tech.city || 'Local Area'}
          </div>
          <div className="flex items-center gap-2 mt-2 text-gray-600">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> {tech.rating || '4.8'} Rating
          </div>
        </div>

        <div className="flex-1 space-y-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
            <p className="text-gray-600 leading-relaxed">
              {tech.name} is a verified {tech.skill || 'appliance repair professional'} with extensive experience. They are highly rated for quick and reliable service.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-2xl">
              <p className="text-sm font-medium text-gray-500 mb-1">Specialty</p>
              <p className="font-semibold text-gray-900 flex items-center gap-2"><Wrench className="w-4 h-4" /> {tech.skill || 'Expert Service'}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl">
              <p className="text-sm font-medium text-gray-500 mb-1">Experience</p>
              <p className="font-semibold text-gray-900 flex items-center gap-2"><Clock className="w-4 h-4" /> {tech.experience || '5'} Years</p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <Button onClick={handleBook} disabled={!!bookingStatus} className="w-full bg-gray-900 text-white hover:bg-gray-800 text-lg py-6 rounded-2xl font-bold shadow-sm">
              {bookingStatus || 'Book Now'}
            </Button>
            <p className="text-xs text-center text-gray-400 mt-4">No payment required until service is complete.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
