
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, CheckSquare, Search, Briefcase, MapPin, Star, Clock, MoreVertical, Camera, CheckCircle, XCircle } from 'lucide-react';

export function TechnicianDashboard() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user?.email) fetchRequests();
  }, [user]);

  const fetchRequests = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/technician/${user.email}`);
      const data = await res.json();
      if (data.success) setRequests(data.bookings);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const res = await fetch('http://localhost:5000/api/upload/avatar', { method: 'POST', credentials: 'include', body: formData });
      const data = await res.json();
      if (data.success) {
        login({ ...user, avatar: data.avatarUrl });
        alert('Profile picture updated!');
      }
    } catch {
      alert('Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchRequests();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleSignOut = async () => {
    await logout();
    navigate('/login');
  };

  const pending = requests.filter(r => r.status === 'PENDING');
  const active = requests.filter(r => r.status === 'ACCEPTED');
  const completed = requests.filter(r => r.status === 'COMPLETED');
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const avatarUrl = user?.avatar ? user.avatar : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'T')}&background=e0e7ff&color=3730a3&size=200`;

  if (loading) return <div className="p-12 text-center text-gray-500">Loading...</div>;

  return (
    <div className="w-full max-w-[1400px] mx-auto min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        
        {/* SIDEBAR */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm flex flex-col items-center text-center">
            <div className="relative mb-4 cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
              <img src={avatarUrl} alt="Profile" className="w-24 h-24 rounded-full object-cover shadow-sm group-hover:opacity-80 transition-opacity" />
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              <div className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md text-gray-700">
                <Camera className="w-4 h-4" />
              </div>
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-900">{user?.name?.split(' ').reverse().join(', ') || 'Technician'}</h2>
            <p className="text-gray-500 text-sm mt-1">{user?.skill || 'Service Professional'}</p>
            <p className="text-gray-400 text-xs mt-0.5">{user?.city || 'Bhopal, MP'}</p>

            <div className="w-full h-px bg-gray-100 my-6"></div>

            <div className="w-full grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Rating</p>
                <p className="text-lg font-bold text-gray-900 flex items-center justify-center gap-1">
                  4.8 <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                </p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Completed</p>
                <p className="text-lg font-bold text-gray-900">{completed.length}</p>
              </div>
            </div>

            <div className="w-full h-px bg-gray-100 my-6"></div>

            <div className="w-full">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 text-left">Earnings</p>
              <p className="text-2xl font-bold text-gray-900 text-left">Rs. {completed.length * 1500}</p>
            </div>
          </div>

          <div className="bg-[#1a1a1a] rounded-3xl p-6 text-white shadow-xl">
            <h3 className="text-lg font-bold mb-1">Shift active</h3>
            <p className="text-sm text-gray-400 mb-6">You are receiving requests.</p>
            <Button onClick={handleSignOut} className="w-full bg-white/10 text-white hover:bg-red-500 hover:text-white rounded-xl transition-colors border-none shadow-none">
              Sign Out
            </Button>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 flex flex-col gap-6">
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Hello {user?.name?.split(' ')[0]}!</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* SCHEDULE CARD */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center">
                  <CalendarIcon className="w-4 h-4 text-gray-600" />
                </div>
                <h3 className="font-semibold text-gray-900">{today}</h3>
              </div>
              
              <div className="flex gap-4 border-b border-gray-100 mb-4">
                <div className="pb-3 border-b-2 border-gray-900 text-sm font-semibold text-gray-900 flex items-center gap-2">
                  Active Jobs <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-xs">{active.length}</span>
                </div>
              </div>

              <div className="flex-1 space-y-4">
                {active.length > 0 ? active.map((job, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-20 flex-shrink-0 text-right pt-0.5">
                      <p className="text-sm font-bold text-gray-900">Now</p>
                    </div>
                    <div className="w-0.5 bg-gray-100 relative">
                      <div className="absolute top-1.5 -left-1 w-2.5 h-2.5 rounded-full bg-teal-600 ring-4 ring-white"></div>
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-xs text-gray-400 mb-0.5">{job.customerName}</p>
                      <p className="text-sm font-semibold text-gray-900">{job.skill}</p>
                    </div>
                  </div>
                )) : (
                  <div className="py-8 text-center text-sm text-gray-400">No active jobs. Accept a request!</div>
                )}
              </div>
            </div>

            {/* REQUESTS CARD */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-[#fff9c4] border border-[#fff59d] flex items-center justify-center">
                  <Clock className="w-4 h-4 text-[#f57f17]" />
                </div>
                <h3 className="font-semibold text-gray-900">Incoming Requests</h3>
                {pending.length > 0 && <span className="ml-auto bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{pending.length} NEW</span>}
              </div>
              
              <div className="space-y-3 flex-1 overflow-y-auto pr-2">
                {pending.map((req, i) => (
                  <div key={i} className="p-4 rounded-2xl border border-gray-100 bg-gray-50 shadow-sm flex flex-col gap-3">
                    <div>
                      <p className="text-sm font-bold text-gray-900">{req.skill}</p>
                      <p className="text-xs text-gray-500 mt-1">{req.customerName} • {req.distance || '2.5 km'} away</p>
                    </div>
                    <div className="flex gap-2 w-full mt-1">
                      <button onClick={() => handleStatusChange(req._id, 'CANCELLED')} className="flex-1 flex items-center justify-center gap-1 py-1.5 border border-gray-300 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-100">
                        <XCircle className="w-3 h-3" /> Decline
                      </button>
                      <button onClick={() => handleStatusChange(req._id, 'ACCEPTED')} className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-[#004d40] rounded-lg text-xs font-semibold text-white hover:bg-[#00332a]">
                        <CheckCircle className="w-3 h-3" /> Accept
                      </button>
                    </div>
                  </div>
                ))}

                {pending.length === 0 && (
                  <div className="py-8 text-center text-sm text-gray-400">No incoming requests.</div>
                )}
              </div>
            </div>
            
          </div>

          {/* ACTIVE SERVICES */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-gray-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Manage Active Services</h3>
              </div>
            </div>

            <div className="space-y-4">
              {active.length > 0 ? active.map((job, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-t border-gray-100">
                  <div className="flex items-start gap-4">
                    <div className="mt-1"><MapPin className="w-4 h-4 text-gray-400" /></div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{job.skill}</p>
                      <p className="text-xs text-gray-500 mt-1">{job.bookingId} • {job.customerName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 sm:ml-auto">
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">{job.cost || 'Rs. 1500'}</p>
                      <p className="text-xs text-[#f57f17] font-bold">IN PROGRESS</p>
                    </div>
                    <Button onClick={() => handleStatusChange(job._id, 'COMPLETED')} className="bg-[#004d40] hover:bg-[#00332a] text-white rounded-xl text-xs h-9">
                      Mark Completed
                    </Button>
                  </div>
                </div>
              )) : (
                <div className="py-8 text-center text-sm text-gray-400 border-t border-gray-100">No active service jobs.</div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
