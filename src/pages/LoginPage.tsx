import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import TextField from '../components/ui/TextField';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
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
    } catch (err) {
      setError('Failed to sign in. Please check your credentials.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await resetPassword(email);
      setResetSent(true);
    } catch (err) {
      setError('Failed to send password reset email');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-accent-pink to-accent-red bg-clip-text text-transparent">
          Login to Your Account
        </h2>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500 bg-opacity-20 text-red-200 text-sm">
            {error}
          </div>
        )}

        {resetSent && (
          <div className="mb-4 p-3 rounded-lg bg-green-500 bg-opacity-20 text-green-200 text-sm">
            Password reset instructions have been sent to your email!
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
                className="text-accent-pink hover:text-accent-red transition-colors"
              >
                Forgot password?
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
            disabled={loading}
          >
            Login
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage; 