import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User,IdCard } from 'lucide-react';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    username:'',
    name:''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md ">
          {/* Glassmorphism card */}
          <div className="backdrop-blur-2xl bg-gradient-to-tr from-black via-zinc-900 to-zinc-950 border border-zinc-600/100 rounded-4xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
             
              <h1 className="text-3xl font-montserrat font-semibold text-white mb-2">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className="text-gray-300">
                {isLogin ? 'Sign in to your account' : 'Join us today'}
              </p>
            </div>

            {/* Form */}
            <div className="space-y-6">
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
                    className="w-full pl-12 pr-4 py-3 bg-[#1D1E22] border border-white/20 rounded-full text-white placeholder-gray-400  focus:outline-none focus:ring-1 focus:ring-[#73CCCB] focus:border-transparent transition-all duration-300 mb-0"
                    placeholder="Username"
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
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 bg-[#1D1E22] border border-white/20 rounded-full text-white placeholder-gray-400  focus:outline-none focus:ring-1 focus:ring-[#73CCCB] focus:border-transparent transition-all duration-300"
                  placeholder="Full Name"
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
                  className="w-full pl-12 pr-4 py-3 bg-[#1D1E22] border border-white/20 rounded-full text-white placeholder-gray-400  focus:outline-none focus:ring-1 focus:ring-[#73CCCB] focus:border-transparent transition-all duration-300"
                  placeholder="Email Address"
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
                  className="w-full pl-12 pr-12 py-3 bg-[#1D1E22] border border-white/20 rounded-full text-white placeholder-gray-400  focus:outline-none focus:ring-1 focus:ring-[#73CCCB] focus:border-transparent transition-all duration-300"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#73CCCB] transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {isLogin && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center text-gray-300">
                    <input type="checkbox" className="mr-2 rounded bg-white/10 border-white/20" />
                    Remember me
                  </label>
                  <a href="#" className="text-[#73CCCB] hover:text-[#76eae8] transition-colors">
                    Forgot password?
                  </a>
                </div>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                className="w-full py-3 px-4 bg-gradient-to-br from-[#92FDFA] via-[#27F8F1] to-[#49F0A8] text-black font-montserrat font-bold rounded-2xl shadow-lg hover:from-[#49F0A8] hover:[#92FDFA] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent transform transition-all duration-300"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </div>

            {/* Social login */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-transparent text-gray-400">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button className="w-full inline-flex justify-center py-3 px-4 rounded-full shadow-sm bg-[#1D1E22] border border-white/20 text-white hover:bg-white/20 transition-all duration-300 backdrop-blur-sm">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </button>
                <button className="w-full inline-flex justify-center py-3 px-4 rounded-full shadow-sm bg-[#1D1E22] border border-white/20 text-white hover:bg-white/20 transition-all duration-300 backdrop-blur-sm">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Toggle between login and signup */}
            <div className="mt-6 text-center">
              <p className="text-gray-300">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
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