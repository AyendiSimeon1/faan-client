"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import AuthPageLayout from '@/components/layout/AuthLayout';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { resetPassword } from '@/store/slice/auth';

interface Props {
  params: Promise<{
    token: string;
  }>;
}

const ResetPasswordPage = ({ params }: Props) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const [password, setPassword] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const { token } = React.use(params); // Properly unwrap the params promise
  const handleSubmit = async () => {
    if (password && token) {
      const result = await dispatch(resetPassword({ 
        token, 
        newPassword: password 
      }));
        if (resetPassword.fulfilled.match(result)) {
        setShowSuccess(true);
        setTimeout(() => {
          router.push('/signin');
        }, 2000);
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
    >      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#2C2C2E] mb-4">Reset Password</h1>
        <p className="text-lg text-[#8A8A8E]">
          Enter your new password below
        </p>
      </div>      {error && (
        <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-lg text-center">
          {error}
        </div>
      )}
      
      {showSuccess && (
        <div className="mb-8 p-4 bg-green-50 text-green-600 rounded-lg text-center">
          Password reset successful! Redirecting to sign in...
        </div>
      )}
      
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

      {isLoading && (
        <div className="flex justify-center">
          <div className="w-16 h-16 border-4 border-[#FDB813] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </AuthPageLayout>
  );
};

export default ResetPasswordPage;
