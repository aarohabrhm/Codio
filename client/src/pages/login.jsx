import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, IdCard } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import hook
import OTPVerification from './OTPVerification'; // Ensure path is correct

export default function Login() {
  const navigate = useNavigate(); // Initialize hook
  
  const [isLogin, setIsLogin] = useState(true);
  const [showOtp, setShowOtp] = useState(false); 
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    fullname: ''
  });

  const handleInputChange = (e) => {
    if (error) setError('');
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const endpoint = isLogin ? '/login' : '/register';
    const url = `http://localhost:8000/api/auth${endpoint}`;

    try {
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : { 
            fullname: formData.fullname,
            username: formData.username,
            email: formData.email, 
            password: formData.password 
          };

      const response = await axios.post(url, payload);

      if (isLogin) {
        // --- 1. LOGIN SUCCESS LOGIC ---
        // Save tokens
        localStorage.setItem('accessToken', response.data.accesstoken);
        if (response.data.refreshToken) {
            localStorage.setItem('refreshToken', response.data.refreshToken);
        }

        console.log('Login successful!', response.data);
        
        // REDIRECT TO DASHBOARD
        navigate('/dashboard'); 
        
      } else {
        // --- 2. REGISTER SUCCESS LOGIC ---
        console.log('Registration successful! OTP Sent.');
        setShowOtp(true); // Show OTP Component
      }

    } catch (err) {
      const errorMessage = err.response ? err.response.data.message : 'An unexpected error occurred.';
      setError(errorMessage);
    }
  };

  // --- 3. OTP VERIFICATION SUCCESS LOGIC ---
  const handleOtpSuccess = () => {
    setShowOtp(false);   // Hide OTP screen
    setIsLogin(true);    // Switch to Login Form
    setSuccessMsg('Account verified successfully! Please login.');
    
    // We keep the email/password filled in so the user just clicks "Sign In"
    // But we clear the password if you prefer security over convenience:
    // setFormData(prev => ({ ...prev, password: '' })); 
  };

  const handleOtpBack = () => {
    setShowOtp(false); // Go back to Signup form
  };

  // --- RENDER OTP COMPONENT ---
  if (showOtp) {
    return (
      <OTPVerification 
        email={formData.email} 
        onVerified={handleOtpSuccess} 
        onBack={handleOtpBack} 
      />
    );
  }

  // --- RENDER LOGIN/SIGNUP FORM ---
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md ">
          <div className="backdrop-blur-2xl bg-gradient-to-tr from-black via-zinc-900 to-zinc-950 border border-zinc-600/100 rounded-4xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-montserrat font-semibold text-white mb-2">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className="text-gray-300">
                {isLogin ? 'Sign in to your account' : 'Join us today'}
              </p>
            </div>

            {/* Success Message Area */}
            {successMsg && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-xl flex items-center justify-center">
                    <p className="text-green-400 text-sm font-medium">{successMsg}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-[#73CCCB] transition-colors" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 bg-[#1D1E22] border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#73CCCB] focus:border-transparent transition-all duration-300 mb-0"
                    placeholder="Username"
                    required
                  />
                </div>
              )}
              {!isLogin && (
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <IdCard className="h-5 w-5 text-gray-400 group-focus-within:text-[#73CCCB] transition-colors" />
                </div>
                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 bg-[#1D1E22] border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#73CCCB] focus:border-transparent transition-all duration-300"
                  placeholder="Full Name"
                  required
                />
              </div>
              )}

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-[#73CCCB] transition-colors" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 bg-[#1D1E22] border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#73CCCB] focus:border-transparent transition-all duration-300"
                  placeholder="Email Address"
                  required
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-[#73CCCB] transition-colors" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-12 py-3 bg-[#1D1E22] border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#73CCCB] focus:border-transparent transition-all duration-300"
                  placeholder="Password"
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
              
              {/* Error Message */}
              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}

              {isLogin && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center text-gray-300">
                    <input type="checkbox" className="mr-2 rounded bg-white/10 border-white/20" />
                    Remember me
                  </label>
                  <button onClick={() => navigate("/forgot-password")} className="text-[#73CCCB] hover:text-[#76eae8] transition-colors">
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-br from-[#92FDFA] via-[#27F8F1] to-[#49F0A8] text-black font-montserrat font-bold rounded-2xl shadow-lg hover:from-[#49F0A8] hover:[#92FDFA] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent transform transition-all duration-300"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-300">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                    setSuccessMsg('');
                  }}
                  className="ml-2 text-[#73CCCB] hover:text-[#59bebd] font-semibold transition-colors"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}