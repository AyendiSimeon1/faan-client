"use client";
import React, { useEffect, Suspense } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import AuthPageLayout from '@/components/layout/AuthLayout';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginUser } from '@/store/slice/auth';


interface SignInFormData {
  email: string;
  password_field: string; // Renamed to avoid potential conflicts
}

// Component that uses useSearchParams - needs to be wrapped in Suspense
const SignInForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<SignInFormData>({
  
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  // Get the return URL from query parameters
  const returnUrl = searchParams.get('returnUrl') || '/';

  console.log('isAuthenticated:', isAuthenticated);
  console.log('returnUrl:', returnUrl);
  
  const onSubmit: SubmitHandler<any> =  (data) => {
    dispatch(loginUser(data));
  };

  useEffect(() => {
    if (isAuthenticated) {
      // Redirect to the return URL or home page
      console.log('Redirecting authenticated user to:', returnUrl);
      router.push(returnUrl);
    }
  }, [isAuthenticated, router, returnUrl]);

  return (
    <AuthPageLayout showLogo>
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#2C2C2E] mb-2">Welcome back!</h1>
        <p className="text-sm text-[#8A8A8E]">
          Sign in to track sessions and enjoy faster exits 🚶 <span role="img" aria-label="key">🔑</span>
        </p>
        {returnUrl !== '/' && (
          <p className="text-xs text-blue-600 mt-2">
            Please log in to continue to your requested page
          </p>
        )}
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input<SignInFormData>
          name="email"
          label="Email"
          type="email"
          placeholder="joymiracle@gmail.com"
          register={register}
          error={errors.email}
        //   rules={{ required: 'Email is required' }}
        />
        <Input<SignInFormData>
          name="password_field"
          label="Password"
          type="password"
          placeholder="Enter your password"
          register={register}
          error={errors.password_field}
        //   rules={{ required: 'Password is required' }}
        />
        <div className="text-right">
          <Link href="/forgot-password">
            <p className="text-sm font-medium text-[#FDB813] hover:text-[#E0A00A]">Forgot Password?</p>
          </Link>
        </div>
        <Button 
          type="submit" 
          variant="primary" 
          fullWidth
          disabled={isLoading}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>
        <Button 
          type="button" 
          variant="link" 
          fullWidth 
          className="text-[#34C759] !font-semibold" 
          onClick={() => {
            // For guest users, also consider the return URL
            const guestUrl = returnUrl !== '/' ? `/guest-details?returnUrl=${encodeURIComponent(returnUrl)}` : '/guest-details';
            router.push(guestUrl);
          }}
          disabled={isLoading}
        >
          Continue as Guest
        </Button>
      </form>
    </AuthPageLayout>
  );
};

// Loading component for Suspense fallback
const SignInLoading: React.FC = () => (
  <AuthPageLayout showLogo>
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </AuthPageLayout>
);

// Main component with Suspense wrapper
const SignInPage: React.FC = () => {
  return (
    <Suspense fallback={<SignInLoading />}>
      <SignInForm />
    </Suspense>
  );
};

export default SignInPage;