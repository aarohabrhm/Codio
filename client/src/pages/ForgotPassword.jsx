import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  AuthLayout, 
  AuthInput, 
  PrimaryButton, 
  SecondaryButton, 
  AuthMessage 
} from '../components/auth';

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:8000/api/auth/forgot-password', {
        email,
      });

      setSuccessMsg(res.data.message || 'Reset link sent! Redirecting to login...');
      
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send reset email.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Reset Password"
      subtitle="Enter your email to receive a reset link"
    >
      {/* Toggle Link */}
      <div className="text-center mb-6">
        <p className="text-gray-400">
          Remember your password?{" "}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-white hover:text-cyan-400 font-medium underline underline-offset-2 transition-colors"
          >
            Sign in
          </button>
        </p>
      </div>

      {/* Messages */}
      <div className="space-y-3 mb-6">
        <AuthMessage type="success" message={successMsg} />
        <AuthMessage type="error" message={error} />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          icon={Mail}
          type="email"
          name="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError('');
          }}
          placeholder="Enter your email"
        />

        {/* Submit Button */}
        <div className="pt-2">
          <PrimaryButton loading={loading} disabled={successMsg}>
            Send Reset Link
          </PrimaryButton>
        </div>

        {/* Back Button */}
        <SecondaryButton onClick={() => navigate('/login')}>
          Go Back
        </SecondaryButton>
      </form>
    </AuthLayout>
  );
}