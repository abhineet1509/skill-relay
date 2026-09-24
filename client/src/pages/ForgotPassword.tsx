import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center py-10">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-gray-800">Forgot Password</h2>
        <p className="text-sm text-center text-gray-600">Enter your email address and we'll send you a link to reset your password.</p>
        
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <Input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="you@example.com" 
                required 
                className="mt-1"
              />
            </div>
            
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Send Reset Link
            </Button>
          </form>
        ) : (
          <div className="p-4 text-green-700 bg-green-50 rounded-md">
            Check your email for the reset link!
          </div>
        )}

        <div className="text-center text-sm text-gray-600 mt-4">
          Remembered your password? <Link to="/login" className="font-semibold text-blue-600 hover:underline">Log in</Link>
        </div>
      </div>
    </div>
  );
}
