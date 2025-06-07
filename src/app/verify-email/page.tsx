"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import OtpInput from '@/components/ui/OtpInput';
import Button from '@/components/ui/Button';
import AuthPageLayout from '@/components/layout/AuthLayout';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { sendVerificationEmail, verifyEmailOtp } from '@/store/slice/auth';

const VerifyEmailPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error, emailVerification } = useAppSelector((state) => state.auth);
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    if (!emailVerification.email) {
      router.replace('/signup');
      return;
    }

    // Start countdown for resend button
    const timer = countdown > 0 && setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdown, emailVerification.email, router]);

  useEffect(() => {
    if (emailVerification.isVerified) {
      router.push('/home');
    }
  }, [emailVerification.isVerified, router]);

  const handleVerify = async () => {
    if (otp.length === 6 && emailVerification.email) {
      dispatch(verifyEmailOtp({ email: emailVerification.email, otp }));
    }
  };

  const handleResendCode = () => {
    if (emailVerification.email) {
      dispatch(sendVerificationEmail(emailVerification.email));
      setCountdown(30);
    }
  };

  return (
    <AuthPageLayout
      headerProps={{
        onBack: () => router.back(),
        showBackButton: true,
      }}
      cardClassName="w-full max-w-3xl px-16 py-12"
    >
      <div className="flex flex-col items-center">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#2C2C2E] mb-4">Verify Your Email</h1>
          <p className="text-lg text-[#8A8A8E] mb-2">
            We've sent a verification code to:
          </p>
          <p className="text-xl font-semibold text-[#2C2C2E]">
            {emailVerification.email}
          </p>
        </div>

        <div className="w-full max-w-md">
          <OtpInput
            length={6}
            value={otp}
            onChange={setOtp}
            disabled={isLoading}
            name="verification-code"
          />

          {error && (
            <p className="text-red-500 text-center mt-4">
              {error}
            </p>
          )}

          <div className="mt-8 space-y-4">
            <Button
              type="button"
              variant="primary"
              onClick={handleVerify}
              disabled={otp.length !== 6 || isLoading}
              className="w-full py-4 text-lg"
            >
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </Button>

            <div className="text-center">
              <p className="text-[#8A8A8E] mb-2">
                Didn't receive the code?
              </p>
              {countdown > 0 ? (
                <p className="text-[#2C2C2E]">
                  Resend code in {countdown}s
                </p>
              ) : (
                <button
                  onClick={handleResendCode}
                  className="text-[#FDB813] font-semibold hover:text-[#E5A712] transition-colors"
                  disabled={isLoading}
                >
                  Resend Code
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthPageLayout>
  );
};

export default VerifyEmailPage;
