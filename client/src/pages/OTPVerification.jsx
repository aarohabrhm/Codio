import React, { useEffect, useState, useRef } from 'react';
import { Mail, ArrowLeft, RefreshCw } from 'lucide-react';
import axios from 'axios';

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
      // Ensure this URL matches your backend route exactly
      const res = await axios.post('http://localhost:8000/api/auth/verify-otp', {
        email,
        otp
      });

      // 1. Show Success Message
      setInfo('OTP verified successfully! Redirecting to login...');
      
      // 2. Wait 2 seconds so user can read the message, then "Redirect"
      setTimeout(() => {
        onVerified(res.data); 
      }, 2000);

    } catch (err) {
      const msg = err.response?.data?.message || 'An unexpected error occurred while verifying OTP.';
      setError(msg);
      setLoading(false); // Only stop loading on error (keep loading on success for smooth transition)
    }
    // Note: We removed 'finally { setLoading(false) }' so the button stays loading during the redirect delay
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
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <div className="backdrop-blur-2xl bg-gradient-to-tr from-black via-zinc-900 to-zinc-950 border border-zinc-600/100 rounded-4xl p-8">
            <div className="mb-6 flex items-center">
              <button
                onClick={onBack}
                className="p-2 rounded-full mr-3 bg-white/5 hover:bg-white/10 transition"
                aria-label="back"
              >
                <ArrowLeft className="h-4 w-4 text-gray-200" />
              </button>
              <div>
                <h2 className="text-2xl font-montserrat font-semibold text-white">Verify your email</h2>
                <p className="text-sm text-gray-400">Enter the 6-digit code we sent to your email.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-[#141416] border border-white/10 rounded-xl p-4 mb-6">
              <div className="p-3 rounded-full bg-[#1D1E22]">
                <Mail className="h-5 w-5 text-gray-300" />
              </div>
              <div>
                <p className="text-sm text-gray-300">Code sent to</p>
                <p className="text-white font-medium">{email}</p>
              </div>
            </div>

            <form onSubmit={handleVerify} className="space-y-4">
              <div className="relative group">
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
                  className="w-full pl-4 pr-4 py-3 bg-[#1D1E22] border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#73CCCB] focus:border-transparent transition-all duration-300 text-center tracking-widest text-lg"
                  placeholder="● ● ● ● ● ●"
                  required
                />
              </div>

              {error && <p className="text-sm text-red-500 text-center">{error}</p>}
              {info && <p className="text-sm text-green-400 text-center">{info}</p>}

              <button
                type="submit"
                disabled={otp.length < 6 || loading}
                className={`w-full py-3 px-4 ${otp.length >= 6 && !loading ? 'bg-gradient-to-br from-[#92FDFA] via-[#27F8F1] to-[#49F0A8] text-black' : 'bg-white/8 text-gray-300 cursor-not-allowed'} font-montserrat font-bold rounded-2xl shadow-lg focus:outline-none transition-all duration-300`}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-300">
                Didn't receive the code?
              </p>

              <div className="mt-3 flex items-center justify-center gap-3">
                <button
                  onClick={handleResend}
                  disabled={!canResend || loading}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm focus:outline-none transition ${canResend && !loading ? 'bg-white/10 hover:bg-white/20 text-[#73CCCB]' : 'bg-white/5 text-gray-500 cursor-not-allowed'}`}
                >
                  <RefreshCw className="h-4 w-4" />
                  {canResend ? 'Resend OTP' : `Resend in ${secondsLeft}s`}
                </button>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button onClick={() => { onBack(); }} className="text-sm text-gray-400 hover:text-[#73CCCB]">
                Use a different email
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}