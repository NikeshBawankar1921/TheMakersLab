import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import TextField from '../components/ui/TextField';
import Button from '../components/ui/Button';
import SiteLogo from '../components/ui/SiteLogo';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const { login, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password. Please try again.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError('Failed to sign in. Please check your credentials.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError('Please enter your email address to reset your password');
      return;
    }

    try {
      setError('');
      setResetLoading(true);
      await resetPassword(email);
      setResetSent(true);
      
      setError('');
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email address.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError('Failed to send password reset email. Please try again.');
      }
      console.error(err);
      setResetSent(false);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-[80vh] pt-10">
      {/* Site Logo */}
      <div className="mb-8 animate-float">
        <SiteLogo size="large" />
      </div>
    
      <Card className="w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-accent-pink to-accent-red bg-clip-text text-transparent">
          Login to Your Account
        </h2>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500 bg-opacity-20 text-red-600 text-sm font-medium">
            {error}
          </div>
        )}

        {resetSent && (
          <div className="mb-4 p-3 rounded-lg bg-green-500 bg-opacity-20 text-black text-sm font-medium">
            <p className="font-bold">Password Reset Email Sent!</p>
            <p>Please check your inbox at <span className="font-bold">{email}</span> for instructions to reset your password.</p>
            <p className="mt-1 text-xs">If you don't see the email, please check your spam folder.</p>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            required
          />
          
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm">
              <button
                type="button"
                onClick={handleResetPassword}
                disabled={resetLoading}
                className={`text-accent-pink hover:text-accent-red transition-colors ${resetLoading ? 'opacity-70 cursor-wait' : ''}`}
              >
                {resetLoading ? 'Sending...' : 'Forgot password?'}
              </button>
            </div>
            <div className="text-sm">
              <Link to="/register" className="text-accent-pink hover:text-accent-red transition-colors">
                Don't have an account?
              </Link>
            </div>
          </div>
          
          <Button
            type="submit"
            fullWidth
            isLoading={loading}
            disabled={loading || resetLoading}
          >
            Login
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage; 