import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'; // Import useParams

export default function ResetPassword() {
  const navigate = useNavigate();
  
  // 1. Get the token from the URL (e.g., /reset-password/:token)
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
      // 2. Send request to backend with token in URL
      const res = await axios.post(`http://localhost:8000/api/auth/reset-password/${token}`, {
        password: form.password,
      });

      setSuccessMsg(res.data.message || 'Password has been reset successfully.');

      // Clear fields
      setForm({ password: '', confirmPassword: '' });

      // 3. Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      // Handle invalid/expired token errors
      const msg = err.response?.data?.message || 'Failed to reset password. Link may be expired.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md ">
          <div className="backdrop-blur-2xl bg-gradient-to-tr from-black via-zinc-900 to-zinc-950 border border-zinc-600/100 rounded-4xl p-8">

            <div className="mb-4">
              <button
                onClick={() => navigate('/login')}
                className="p-2 rounded-full mr-3 bg-white/5 hover:bg-white/10 transition text-gray-300 flex items-center"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="ml-2 text-sm">Back to Login</span>
              </button>
            </div>

            <div className="text-center mb-6">
              <h1 className="text-3xl font-montserrat font-semibold text-white mb-2">
                Set New Password
              </h1>
              <p className="text-gray-300">
                Enter your new password below
              </p>
            </div>

            {/* Success message */}
            {successMsg && (
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-xl text-center">
                <p className="text-green-400 text-sm font-medium">{successMsg}</p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-center">
                 <p className="text-sm text-red-500 font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* New password */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-[#73CCCB] transition-colors" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-3 bg-[#1D1E22] border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#73CCCB] focus:border-transparent transition-all duration-300"
                  placeholder="New Password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#73CCCB] transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {/* Confirm password */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-[#73CCCB] transition-colors" />
                </div>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-3 bg-[#1D1E22] border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#73CCCB] focus:border-transparent transition-all duration-300"
                  placeholder="Confirm Password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#73CCCB] transition-colors"
                >
                  {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || successMsg}
                className={`w-full py-3 px-4 bg-gradient-to-br from-[#92FDFA] via-[#27F8F1] to-[#49F0A8] text-black font-montserrat font-bold rounded-2xl shadow-lg focus:outline-none transition-all duration-300 ${loading || successMsg ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>

            <div className="mt-6 text-center">
               <p className="text-gray-300 text-sm">
                 Link expired? 
                 <button onClick={() => navigate('/forgot-password')} className="ml-1 text-[#73CCCB] hover:underline">
                    Request a new one
                 </button>
               </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}