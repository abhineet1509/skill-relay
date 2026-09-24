import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useAuth } from '../components/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/auth/verify-otp', { email, otp }, { withCredentials: true });
      if (response.data.success) {
        login(response.data.user);
        navigate('/profile');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed');
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/google', { token: credentialResponse.credential }, { withCredentials: true });
      if (response.data.success) {
        login(response.data.user);
        navigate('/profile');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Google Sign-In failed');
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center py-10">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          {step === 1 ? 'Create an Account' : 'Verify Your Email'}
        </h2>

        {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm text-center rounded-lg px-4 py-2">{error}</div>}

        {step === 1 ? (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <Input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" required className="mt-1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required className="mt-1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required className="mt-1" />
            </div>
            <Button type="submit" className="w-full bg-gray-900 hover:bg-gray-700">Register</Button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="text-center text-sm text-gray-600 bg-blue-50 border border-blue-100 rounded-lg p-3">
              A 6-digit code has been sent to <strong>{email}</strong>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 text-center mb-2">Enter OTP</label>
              <Input
                type="text"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                placeholder="123456"
                required
                className="text-center tracking-[0.5em] text-xl font-semibold"
                maxLength={6}
              />
            </div>
            <Button type="submit" className="w-full bg-gray-900 hover:bg-gray-700">Verify & Continue</Button>
            <button type="button" onClick={() => { setStep(1); setOtp(''); setError(''); }} className="w-full text-sm text-gray-500 hover:text-gray-700">
              Go back
            </button>
          </form>
        )}

        {step === 1 && (
          <>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google Sign-In failed. Make sure pop-ups are allowed.')}
                useOneTap={false}
                text="signup_with"
                shape="rectangular"
                width="368"
              />
            </div>
          </>
        )}

        <div className="text-center text-sm text-gray-600 mt-4">
          Already have an account? <Link to="/login" className="font-semibold text-gray-900 font-semibold hover:underline">Log in</Link>
        </div>
      </div>
    </div>
  );
}




