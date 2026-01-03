import React, { useEffect, useState, useRef } from 'react';
import { Mail, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { 
  AuthLayout, 
  PrimaryButton, 
  SecondaryButton, 
  AuthMessage 
} from '../components/auth';

export default function OTPVerification({ email, onVerified = () => {}, onBack = () => {} }) {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  const [secondsLeft, setSecondsLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    startCountdown();
    return () => clearInterval(timerRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startCountdown = () => {
    setCanResend(false);
    setSecondsLeft(60);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:8000/api/auth/verify-otp', {
        email,
        otp
      });

      setInfo('OTP verified successfully! Redirecting...');
      
      setTimeout(() => {
        onVerified(res.data); 
      }, 2000);

    } catch (err) {
      const msg = err.response?.data?.message || 'An unexpected error occurred while verifying OTP.';
      setError(msg);
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setInfo('');
    setLoading(true);
    try {
      await axios.post('http://localhost:8000/api/auth/resend-otp', { email });
      setInfo('OTP resent. Check your email.');
      startCountdown();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to resend OTP.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Verify Your Email"
      subtitle="Enter the 6-digit code we sent to your email"
    >
      {/* Email Display */}
      <div className="flex items-center gap-3 bg-[#141414] border border-gray-800 rounded-xl p-4 mb-6">
        <div className="p-3 rounded-full bg-[#0a0a0a]">
          <Mail className="h-5 w-5 text-gray-400" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Code sent to</p>
          <p className="text-white font-medium">{email}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="space-y-3 mb-6">
        <AuthMessage type="success" message={info} />
        <AuthMessage type="error" message={error} />
      </div>

      {/* Form */}
      <form onSubmit={handleVerify} className="space-y-4">
        {/* OTP Input */}
        <div className="relative">
          <input
            type="text"
            inputMode="numeric"
            pattern="\d*"
            name="otp"
            value={otp}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 6);
              setOtp(val);
              if (error) setError('');
            }}
            className="w-full px-4 py-3.5 bg-[#141414] border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-700 transition-all text-center tracking-[0.5em] text-xl font-mono"
            placeholder="● ● ● ● ● ●"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <PrimaryButton loading={loading} disabled={otp.length < 6}>
            Verify OTP
          </PrimaryButton>
        </div>

        {/* Resend Section */}
        <div className="text-center pt-2">
          <p className="text-sm text-gray-500 mb-3">Didn't receive the code?</p>
          <button
            type="button"
            onClick={handleResend}
            disabled={!canResend || loading}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              canResend && !loading 
                ? 'bg-white/5 hover:bg-white/10 text-white border border-gray-700' 
                : 'bg-transparent text-gray-600 cursor-not-allowed'
            }`}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {canResend ? 'Resend OTP' : `Resend in ${secondsLeft}s`}
          </button>
        </div>

        {/* Back Button */}
        <SecondaryButton onClick={onBack}>
          Use a different email
        </SecondaryButton>
      </form>
    </AuthLayout>
  );
}