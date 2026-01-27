import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, User, IdCard, Key } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import OTPVerification from './OTPVerification';
import { 
  AuthLayout, 
  AuthInput, 
  PrimaryButton, 
  SecondaryButton, 
  LinkButton, 
  AuthMessage 
} from '../components/auth';

export default function Login() {
  const navigate = useNavigate();
  
  const [isLogin, setIsLogin] = useState(true);
  const [showOtp, setShowOtp] = useState(false); 
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    fullname: ''
  });

  // Check if user is already logged in on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          // Verify token is still valid
          const response = await axios.get('http://localhost:8000/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (response.data) {
            // User is authenticated, redirect to dashboard
            navigate('/dashboard');
          }
        } catch (err) {
          // Token is invalid or expired, clear it
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      }
    };

    checkAuth();
  }, [navigate]);

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
    setLoading(true);

    const endpoint = isLogin ? '/login' : '/register';
    const url = `http://localhost:8000/api/auth${endpoint}`;

    try {
      const payload = isLogin
        ? { email: formData.email, password: formData.password, rememberMe } // Added rememberMe
        : { 
            fullname: formData.fullname,
            username: formData.username,
            email: formData.email, 
            password: formData.password 
          };

      const response = await axios.post(url, payload);

      if (isLogin) {
        localStorage.setItem('accessToken', response.data.accesstoken);
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken);
        }
        // Store rememberMe preference
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        } else {
          localStorage.removeItem('rememberMe');
        }
        navigate('/dashboard'); 
      } else {
        setShowOtp(true);
      }
    } catch (err) {
      const errorMessage = err.response ? err.response.data.message : 'An unexpected error occurred.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSuccess = () => {
    setShowOtp(false);
    setIsLogin(true);
    setSuccessMsg('Account verified successfully! Please login.');
  };

  const handleOtpBack = () => {
    setShowOtp(false);
  };

  if (showOtp) {
    return (
      <OTPVerification 
        email={formData.email} 
        onVerified={handleOtpSuccess} 
        onBack={handleOtpBack} 
      />
    );
  }

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccessMsg('');
  };

  return (
    <AuthLayout 
      title={isLogin ? 'Welcome Back' : 'Create Account'}
      subtitle={isLogin ? 'Sign in to continue coding' : 'Join thousands of developers'}
    >
      {/* Toggle Link */}
      <div className="text-center mb-6">
        <p className="text-gray-400">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={toggleMode}
            className="text-white hover:text-cyan-400 font-medium underline underline-offset-2 transition-colors"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
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
        {/* Signup Fields */}
        {!isLogin && (
          <>
            <AuthInput
              icon={User}
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter your username"
            />
            <AuthInput
              icon={IdCard}
              name="fullname"
              value={formData.fullname}
              onChange={handleInputChange}
              placeholder="Enter your name"
            />
          </>
        )}

        {/* Email */}
        <AuthInput
          icon={Mail}
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Enter your email"
        />

        {/* Password */}
        <AuthInput
          icon={Lock}
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Enter your password"
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

        {/* Remember & Forgot */}
        {isLogin && (
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-gray-400 cursor-pointer">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mr-2 w-4 h-4 rounded bg-[#141414] border-gray-700 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-0" 
              />
              Remember me
            </label>
            <button 
              type="button"
              onClick={() => navigate("/forgot-password")} 
              className="text-gray-400 hover:text-white transition-colors"
            >
              Forgot password?
            </button>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2">
          <PrimaryButton loading={loading}>
            {isLogin ? 'Sign In' : 'Get Started'}
          </PrimaryButton>
        </div>

        {/* Back Button (for signup) */}
        {!isLogin && (
          <SecondaryButton onClick={toggleMode}>
            Go Back
          </SecondaryButton>
        )}
      </form>

      
      
    </AuthLayout>
  );
}