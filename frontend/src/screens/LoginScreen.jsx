import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BrandHeader from '@/components/ui/BrandHeader';
import TextField from '@/components/ui/TextField';
import Button from '@/components/ui/Button';

export default function LoginScreen() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(30);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    let interval;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleRequestOTP = async () => {
    if (mobile.length < 10) {
      setError("Please enter a valid 10-digit number");
      return;
    }
    setLoading(true);
    setError('');

    const payload = { mobileNumber: `+91${mobile}` };
    console.log("Sending OTP Request to:", `${API_BASE_URL}/api/auth/request-otp`, payload);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setStep(2);
        setTimer(30);
      } else {
        const errData = await response.json().catch(() => ({}));
        setError(errData.message || "Something went wrong. Try again.");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Network error. Check your Go server.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    setError('');

    const payload = { mobileNumber: `+91${mobile}`, otp: otp };

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('dealjosh_token', data.token);
        navigate('/register-store', { state: { mobileNumber: `+91${mobile}` } });
      } else {
        setError(data.message || "Invalid OTP code");
      }
    } catch (err) {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col flex-1 mt-6 animate-in fade-in duration-700">
      <BrandHeader 
        title={step === 1 ? "Merchant Login" : "Verify Number"} 
        subtitle={step === 1 ? "Grow your business with DealJosh" : `We sent a code to +91 ${mobile}`} 
      />

      <div className="flex-1 mt-10">
        {error && (
          <div className="animate-in zoom-in duration-300">
             <p className="text-dj-red text-[11px] font-bold text-center mb-6 bg-red-50 p-3 rounded-2xl border border-red-100">
              {error}
            </p>
          </div>
        )}

        {step === 1 ? (
          <div className="animate-in slide-in-from-left-4 duration-500">
            <TextField 
              label="Mobile Number" 
              prefix="+91" 
              placeholder="Enter 10 digits" 
              value={mobile} 
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))} 
              maxLength={10}
              inputMode="tel"
            />
          </div>
        ) : (
          <div className="animate-in slide-in-from-right-4 duration-500">
            <TextField 
              label="Enter 5-Digit OTP" 
              placeholder="•••••" 
              value={otp} 
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} 
              maxLength={5}
              inputMode="numeric"
              autoComplete="one-time-code"
            />
            
            {/* Cleaned up bottom row: Just the Resend timer aligned right */}
            <div className="mt-4 flex justify-end items-center px-2">
              {timer > 0 ? (
                <span className="text-[10px] font-bold text-gray-400">Resend in {timer}s</span>
              ) : (
                <button onClick={handleRequestOTP} className="text-[10px] font-black text-dj-red underline uppercase tracking-tighter">Resend Now</button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="pb-8">
        <Button 
          onClick={step === 1 ? handleRequestOTP : handleVerifyOTP} 
          isLoading={loading}
          disabled={step === 1 ? mobile.length < 10 : otp.length < 5}
        >
          {step === 1 ? "Send Secure OTP" : "Verify & Continue"}
        </Button>
      </div>
    </div>
  );
}