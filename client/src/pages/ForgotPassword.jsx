import React, { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
      // 1. Send Request
      const res = await axios.post('http://localhost:8000/api/auth/forgot-password', {
        email,
      });

      // 2. Handle Success
      setSuccessMsg(res.data.message || 'Reset link sent! Redirecting to login...');
      
      // 3. Redirect to Login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (err) {
      // 4. Handle Errors (User not found, Server error, etc.)
      const msg = err.response?.data?.message || 'Failed to send reset email.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <div className="backdrop-blur-2xl bg-gradient-to-tr from-black via-zinc-900 to-zinc-950 border border-zinc-600/100 rounded-4xl p-8">

            <button
              className="mb-6 flex items-center text-gray-300 hover:text-white transition"
              onClick={() => navigate("/login")}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </button>

            <div className="text-center mb-8">
              <h1 className="text-3xl font-montserrat font-semibold text-white mb-2">
                Reset Password
              </h1>
              <p className="text-gray-300">
                Enter your email to receive a reset link
              </p>
            </div>

            {/* Success Message */}
            {successMsg && (
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-xl text-center">
                <p className="text-green-400 text-sm font-medium">{successMsg}</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-center">
                 <p className="text-sm text-red-500 font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-[#73CCCB] transition-colors" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full pl-12 pr-4 py-3 bg-[#1D1E22] border border-white/20 
                  rounded-full text-white placeholder-gray-400 focus:outline-none 
                  focus:ring-1 focus:ring-[#73CCCB] focus:border-transparent transition-all duration-300"
                  placeholder="Email Address"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || successMsg} // Disable if loading or already succeeded
                className={`w-full py-3 px-4 bg-gradient-to-br from-[#92FDFA] via-[#27F8F1] 
                to-[#49F0A8] text-black font-montserrat font-bold rounded-2xl shadow-lg 
                hover:from-[#49F0A8] hover:[#92FDFA] transition-all duration-300 
                ${(loading || successMsg) ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-300">
                Remember your password?
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="ml-2 text-[#73CCCB] hover:text-[#59bebd] font-semibold transition-colors"
                >
                  Sign In
                </button>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}