import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useAuth } from '../components/AuthContext';
import axios from 'axios';

const SKILLS = ['AC Repair','Washing Machine','Refrigerator','Plumbing','Electrical','Carpentry','Painting','Microwave','TV/Electronics','CCTV & Security'];

export function TechnicianRegister() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [skill, setSkill] = useState('');
  const [experience, setExperience] = useState('');
  const [city, setCity] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!skill) {
      setError('Please select a primary skill');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password,
        phone,
        role: 'TECHNICIAN',
        skill,
        experience,
        city
      });
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/auth/verify-otp', { email, otp }, { withCredentials: true });
      if (response.data.success) {
        login(response.data.user);
        navigate('/technician/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed');
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center py-10">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-2xl shadow-md border border-gray-200">

        {/* Header */}
        <div className="text-center">
          <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {step === 1 ? 'Join as a Technician' : 'Verify Your Email'}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {step === 1 ? 'Create your professional service account' : `Enter the 6-digit code sent to ${email}`}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 text-center">{error}</div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <Input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Rahul Verma" required />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <Input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <Input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="New Delhi" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Skill</label>
                <select
                  value={skill}
                  onChange={e => setSkill(e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  <option value="">Select skill</option>
                  {SKILLS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience (years)</label>
                <Input type="number" min="0" max="40" value={experience} onChange={e => setExperience(e.target.value)} placeholder="5" required />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" required />
              </div>
            </div>
            <Button type="submit" className="w-full bg-gray-900 hover:bg-gray-700 text-white font-semibold h-11 mt-2">
              Register as Technician
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <Input
              type="text"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              placeholder="123456"
              required
              className="text-center tracking-[0.5em] text-2xl font-bold h-14"
              maxLength={6}
            />
            <Button type="submit" className="w-full bg-gray-900 hover:bg-gray-700 text-white font-semibold h-11">
              Verify & Go to Dashboard
            </Button>
            <button
              type="button"
              onClick={async () => {
                setError('');
                try {
                  await axios.post('http://localhost:5000/api/auth/register', { name, email, password, phone, role: 'TECHNICIAN', skill, experience, city });
                  setError('');
                  alert('New OTP sent! Check your email.');
                } catch (err: any) {
                  setError('Failed to resend OTP');
                }
              }}
              className="w-full text-sm text-gray-500 hover:text-gray-800 underline"
            >
              Resend OTP
            </button>
            <button type="button" onClick={() => { setStep(1); setOtp(''); setError(''); }} className="w-full text-sm text-gray-400 hover:text-gray-700">
              â† Go back
            </button>
          </form>
        )}

        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-gray-900 font-semibold hover:underline">Log in</Link>
        </p>
        <p className="text-center text-sm text-gray-500">
          Looking for a service?{' '}
          <Link to="/register" className="text-gray-900 font-semibold hover:underline">Register as Customer</Link>
        </p>
      </div>
    </div>
  );
}

