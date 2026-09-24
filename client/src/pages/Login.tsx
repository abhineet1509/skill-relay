import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useAuth } from '../components/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/login`, { email, password }, { withCredentials: true });
      if (response.data.success) {
        login(response.data.user);
        navigate(response.data.user.role === 'TECHNICIAN' ? '/technician/dashboard' : '/profile');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/google`, { token: credentialResponse.credential }, { withCredentials: true });
      if (response.data.success) {
        login(response.data.user);
        navigate(response.data.user.role === 'TECHNICIAN' ? '/technician/dashboard' : '/profile');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Google Sign-In failed');
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center py-10">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-gray-800">Welcome Back</h2>

        {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm text-center rounded-lg px-4 py-2">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required className="mt-1" />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <Link to="/forgot-password" className="text-sm text-gray-700 font-semibold hover:underline">Forgot password?</Link>
            </div>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required className="mt-1" />
          </div>
          <Button type="submit" className="w-full bg-gray-900 text-white hover:bg-gray-800">Sign In</Button>
        </form>

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
            text="signin_with"
            shape="rectangular"
            width="368"
          />
        </div>

        <div className="text-center text-sm text-gray-600 mt-4 flex flex-col gap-2">
          <span>Don't have an account? <Link to="/register" className="font-semibold text-gray-700 font-semibold hover:underline">Register here</Link></span>
          <span>Are you a technician? <Link to="/technician-register" className="font-semibold text-gray-700 font-semibold hover:underline">Register as Technician</Link></span>
        </div>
      </div>
    </div>
  );
}




