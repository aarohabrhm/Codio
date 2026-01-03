import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  AuthLayout, 
  AuthInput, 
  PrimaryButton, 
  SecondaryButton, 
  AuthMessage 
} from '../components/auth';

export default function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams(); 

  const [form, setForm] = useState({
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    if (error) setError('');
    if (successMsg) setSuccessMsg('');
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    if (!form.password || !form.confirmPassword) {
      setError('Please fill both password fields.');
      return false;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!validate()) return;

    setLoading(true);
    try {
      const res = await axios.post(`http://localhost:8000/api/auth/reset-password/${token}`, {
        password: form.password,
      });

      setSuccessMsg(res.data.message || 'Password has been reset successfully.');
      setForm({ password: '', confirmPassword: '' });

      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to reset password. Link may be expired.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Set New Password"
      subtitle="Enter your new password below"
    >
      {/* Toggle Link */}
      <div className="text-center mb-6">
        <p className="text-gray-400">
          Link expired?{" "}
          <button
            type="button"
            onClick={() => navigate('/forgot-password')}
            className="text-white hover:text-cyan-400 font-medium underline underline-offset-2 transition-colors"
          >
            Request a new one
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
        {/* New Password */}
        <AuthInput
          icon={Lock}
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="New password"
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-500 hover:text-gray-300 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
        />

        {/* Confirm Password */}
        <AuthInput
          icon={Lock}
          type={showConfirm ? 'text' : 'password'}
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm password"
          rightElement={
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="text-gray-500 hover:text-gray-300 transition-colors"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
        />

        {/* Submit Button */}
        <div className="pt-2">
          <PrimaryButton loading={loading} disabled={successMsg}>
            Reset Password
          </PrimaryButton>
        </div>

        {/* Back Button */}
        <SecondaryButton onClick={() => navigate('/login')}>
          Back to Login
        </SecondaryButton>
      </form>
    </AuthLayout>
  );
}