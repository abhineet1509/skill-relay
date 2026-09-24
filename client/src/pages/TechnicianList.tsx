import { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Wrench, Shield, CheckCircle } from 'lucide-react';

export function TechnicianList() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const q = searchParams.get('search') || '';
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTechs();
  }, [q]);

  const fetchTechs = async () => {
    setLoading(true);
    try {
      const url = q ? `http://localhost:5000/api/technicians?search=${encodeURIComponent(q)}` : `http://localhost:5000/api/technicians`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setTechnicians(data.technicians);
      }
    } catch {
      console.error('Failed to load techs');
    } finally {
      setLoading(false);
    }
  };

  const getAvatar = (t: any) => t.avatar && t.avatar.startsWith('http') ? t.avatar : `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=111827&color=fff&size=200`;

  return (
    <div className="max-w-6xl mx-auto py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Technicians</h1>
      <p className="text-gray-500 mb-8">{q ? `Search results for "${q}"` : 'Browse all top-rated professionals.'}</p>
      
      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : technicians.length === 0 ? (
        <div className="text-gray-500 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">No technicians found. Try a different search.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {technicians.map((tech) => (
            <Link key={tech._id} to={`/technician/${tech._id}`} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all group block">
              <div className="flex items-start gap-4">
                <img src={getAvatar(tech)} alt={tech.name} className="w-16 h-16 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform" />
                <div>
                  <h3 className="font-bold text-lg text-gray-900 leading-tight group-hover:text-gray-700">{tech.name}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><Wrench className="w-3.5 h-3.5" /> {tech.skill || 'Expert Service'}</p>
                  <p className="text-sm text-gray-400 flex items-center gap-1 mt-0.5"><MapPin className="w-3.5 h-3.5" /> {tech.city || 'Your Area'}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-50">
                <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> {tech.rating || '4.8'}
                </div>
                <div className="text-gray-900 font-semibold text-sm">View Profile &rarr;</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
