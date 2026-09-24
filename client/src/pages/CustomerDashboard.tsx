
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, CheckSquare, Search, Briefcase, MapPin, Building2, Star, Clock, ArrowRight, MoreVertical, Wrench } from 'lucide-react';

export function CustomerDashboard() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [orderHistory, setOrderHistory] = useState<any[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newText, setNewText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user?.email) {
      fetch(`http://localhost:5000/api/bookings/customer/${user.email}`)
        .then(res => res.json())
        .then(data => { if (data.success) setOrderHistory(data.bookings); });
    }
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const res = await fetch('http://localhost:5000/api/upload/avatar', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        login({ ...user, avatar: data.avatarUrl });
        alert('Profile picture updated!');
      } else {
        alert('Upload failed: ' + data.message);
      }
    } catch {
      alert('Upload failed. Check server is running.');
    } finally {
      setUploading(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newText) return;
    try {
      const res = await fetch('http://localhost:5000/api/auth/address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle, text: newText }),
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        login({ ...user, addresses: data.addresses });
        setShowAddressForm(false);
        setNewTitle('');
        setNewText('');
      }
    } catch (err) {
      alert('Failed to add address');
    }
  };

  const avatarUrl = user?.avatar ? user.avatar : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=Fbcfe8&color=000&size=200`;

  const upcoming = orderHistory.filter(o => o.status !== 'COMPLETED' && o.status !== 'CANCELLED');
  const past = orderHistory.filter(o => o.status === 'COMPLETED' || o.status === 'CANCELLED');
  const uniqueTechs = Array.from(new Set(orderHistory.map(o => o.technicianName))).filter(Boolean);

  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="w-full max-w-[1400px] mx-auto min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        
        {/* SIDEBAR */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm flex flex-col items-center text-center">
            <div className="relative mb-4 cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
              <img src={avatarUrl} alt="Profile" className="w-24 h-24 rounded-full object-cover shadow-sm group-hover:opacity-80 transition-opacity" />
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-900">{user?.name?.split(' ').reverse().join(', ') || 'User'}</h2>
            <p className="text-gray-500 text-sm mt-1">Customer</p>
            <p className="text-gray-400 text-xs mt-0.5">{user?.city || 'Bhopal, MP'}</p>

            <div className="w-full h-px bg-gray-100 my-6"></div>

            <div className="w-full text-left">
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">Saved Addresses</h3>
              <div className="space-y-4">
                {(user?.addresses && user.addresses.length > 0) ? user.addresses.map((addr: any, i: number) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-600 font-medium text-xs">
                      {addr.title.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{addr.title}</p>
                      <p className="text-xs text-gray-500 line-clamp-1">{addr.text}</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-xs text-gray-400">No saved addresses.</p>
                )}
                
                {showAddressForm ? (
                  <form onSubmit={handleAddAddress} className="mt-4 p-3 border border-gray-200 rounded-xl bg-gray-50 space-y-2">
                    <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Title (e.g. Home)" className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:outline-none" required />
                    <textarea value={newText} onChange={e => setNewText(e.target.value)} placeholder="Address" rows={2} className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:outline-none" required></textarea>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setShowAddressForm(false)} className="flex-1 text-[11px] py-1 border rounded text-gray-600">Cancel</button>
                      <button type="submit" className="flex-1 text-[11px] py-1 bg-gray-900 text-white rounded">Save</button>
                    </div>
                  </form>
                ) : (
                  <button onClick={() => setShowAddressForm(true)} className="text-xs text-gray-500 hover:text-gray-900 font-medium mt-2">+ Add New</button>
                )}
              </div>
            </div>

            <div className="w-full h-px bg-gray-100 my-6"></div>

            <div className="w-full text-left">
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">Favorite Techs</h3>
              <div className="space-y-4">
                {uniqueTechs.length > 0 ? uniqueTechs.slice(0, 3).map((techName: any, i: number) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 text-gray-600 font-medium text-xs">
                      {techName.split(' ').map((n:string)=>n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{techName}</p>
                      <p className="text-xs text-gray-500">Service Expert</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-xs text-gray-400">No favorite technicians yet.</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-[#1f1f1f] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-4">
              <Search className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold mb-1">Need urgent repairs?</h3>
            <p className="text-sm text-gray-400 mb-4">Find a technician now.</p>
            <Button onClick={() => navigate('/technicians')} className="w-full bg-white text-black hover:bg-gray-200 rounded-xl">
              Browse Services
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
                  Upcoming <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-xs">{upcoming.length}</span>
                </div>
                <div className="pb-3 text-sm font-medium text-gray-400 flex items-center gap-2">
                  Past <span className="bg-gray-50 text-gray-400 px-1.5 py-0.5 rounded text-xs">{past.length}</span>
                </div>
              </div>

              <div className="flex-1 space-y-4">
                {upcoming.length > 0 ? upcoming.slice(0, 3).map((job, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-20 flex-shrink-0 text-right pt-0.5">
                      <p className="text-sm font-bold text-gray-900">10:00 AM</p>
                      <p className="text-xs text-gray-400">11:00 AM</p>
                    </div>
                    <div className="w-0.5 bg-gray-100 relative">
                      <div className="absolute top-1.5 -left-1 w-2.5 h-2.5 rounded-full bg-teal-600 ring-4 ring-white"></div>
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-xs text-gray-400 mb-0.5">Service Visit</p>
                      <p className="text-sm font-semibold text-gray-900">{job.skill}</p>
                    </div>
                  </div>
                )) : (
                  <div className="py-8 text-center text-sm text-gray-400">No upcoming appointments.</div>
                )}
              </div>
            </div>

            {/* TO-DOS CARD */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center">
                  <CheckSquare className="w-4 h-4 text-gray-600" />
                </div>
                <h3 className="font-semibold text-gray-900">To-dos</h3>
              </div>
              
              <div className="space-y-3 flex-1 overflow-y-auto pr-2">
                {past.length > 0 ? (
                  <div className="p-4 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors bg-white shadow-sm flex items-start justify-between">
                    <div>
                      <p className="text-sm font-bold text-gray-900 mb-0.5">Leave a review</p>
                      <p className="text-xs text-gray-500">Rate your experience with {past[0].technicianName}.</p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-4">Just now</span>
                  </div>
                ) : null}
                
                {upcoming.map((job, i) => (
                  <div key={i} className="p-4 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors bg-white shadow-sm flex items-start justify-between">
                    <div>
                      <p className="text-sm font-bold text-gray-900 mb-0.5">Prepare for technician</p>
                      <p className="text-xs text-gray-500">Clear area for {job.skill}.</p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-4">Soon</span>
                  </div>
                ))}

                {orderHistory.length === 0 && (
                  <div className="py-8 text-center text-sm text-gray-400">You're all caught up!</div>
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
                <h3 className="font-semibold text-gray-900">Active Services</h3>
              </div>
              <Button onClick={() => navigate('/technicians')} className="bg-[#004d40] hover:bg-[#00332a] text-white rounded-xl">
                Book service
              </Button>
            </div>

            <div className="space-y-4">
              {upcoming.length > 0 ? upcoming.map((job, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-t border-gray-100">
                  <div className="flex items-start gap-4">
                    <div className="mt-1"><MapPin className="w-4 h-4 text-gray-400" /></div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{job.skill}</p>
                      <p className="text-xs text-gray-500 mt-1">{job.bookingId} • Home Address</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 sm:ml-auto">
                    <span className="bg-[#fff9c4] text-[#f57f17] text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                      {job.status === 'ACCEPTED' ? 'TECHNICIAN ON WAY' : 'PENDING'}
                    </span>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">ETA 30m</p>
                      <p className="text-xs text-gray-500">{job.technicianName}</p>
                    </div>
                    <button className="text-gray-400 hover:text-gray-900"><MoreVertical className="w-5 h-5" /></button>
                  </div>
                </div>
              )) : (
                <div className="py-8 text-center text-sm text-gray-400 border-t border-gray-100">No active service requests right now.</div>
              )}
            </div>
            
            {orderHistory.length > 0 && (
              <div className="w-full text-center mt-6 pt-4 border-t border-gray-100">
                <button className="text-sm font-semibold text-[#004d40] hover:underline">View all services</button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
