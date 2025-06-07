"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import OtpInput from '../../components/ui/OtpInput';
import Button from '../../components/ui/Button';
import AuthPageLayout from '@/components/layout/AuthLayout';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { resetPassword } from '@/store/slice/auth';

const OtpPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { isLoading, error, passwordReset } = useAppSelector((state) => state.auth);
  const [password, setPassword] = useState('');

  // Get token from URL path
  useEffect(() => {
    const path = window.location.pathname;
    const token = path.split('/reset-password/')[1];
    
    if (token) {
      // dispatch(validateResetToken(token));
    } else {
      console.log('This stuff failed')
      // router.replace('/forgot-password');
    }
  }, [dispatch, router]);

  const handleSubmit = async () => {
    if (password && passwordReset.token && passwordReset.isValid) {
      const result = await dispatch(resetPassword({ 
        token: passwordReset.token, 
        newPassword: password 
      }));
      
      if (resetPassword.fulfilled.match(result)) {
        router.push('/signin');
      }
    }
  };

  return (
    <AuthPageLayout
      headerProps={{
        onBack: () => router.back(),
        showBackButton: true,
      }}
      cardClassName="w-full max-w-lg px-16 py-12"
    >
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#2C2C2E] mb-4">Reset Password</h1>
        {!passwordReset.isValid ? (
          <p className="text-lg text-[#8A8A8E]">
            Verifying your reset link...
          </p>
        ) : (
          <p className="text-lg text-[#8A8A8E]">
            Enter your new password below
          </p>
        )}
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-lg text-center">
          {error}
        </div>
      )}

      {passwordReset.isValid && (
        <div className="space-y-6">
          <div>
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 text-lg border rounded-xl focus:border-[#FDB813] focus:ring-1 focus:ring-[#FDB813] outline-none"
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!password || isLoading}
            className="w-full py-4 text-lg"
            variant="primary"
          >
            {isLoading ? 'Updating Password...' : 'Update Password'}
          </Button>
        </div>
      )}

      {isLoading && !passwordReset.isValid && (
        <div className="flex justify-center">
          <div className="w-16 h-16 border-4 border-[#FDB813] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </AuthPageLayout>
  );
};

export default OtpPage;