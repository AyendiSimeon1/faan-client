"use client";
import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import AuthPageLayout from '@/components/layout/AuthLayout';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginUser } from '@/store/slice/auth';


interface SignInFormData {
  email: string;
  password_field: string; // Renamed to avoid potential conflicts
}

const SignInPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<SignInFormData>({
    defaultValues: {
      email: "joymiracle@gmail.com" // Pre-filled from mockup
    }
  });
  const router = useRouter();
    const dispatch = useAppDispatch();
    const { isAuthenticated } = useAppSelector((state) => state.auth);

    console.log('isAuthenticated:', isAuthenticated);
  
    const onSubmit: SubmitHandler<any> = (data) => {
      dispatch(loginUser(data));
    };
     console.log('isAuthenticated:', isAuthenticated);
  
    useEffect(() => {
      if (isAuthenticated) {
        router.push('/');
      }
    }, [isAuthenticated, router]);

  return (
    <AuthPageLayout showLogo>
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#2C2C2E] mb-2">Welcome back!</h1>
        <p className="text-sm text-[#8A8A8E]">
          Sign in to track sessions and enjoy faster exits 🚶 <span role="img" aria-label="key">🔑</span>
        </p>
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
        <Button type="submit" variant="primary" fullWidth>
          Sign In
        </Button>
        <Button type="button" variant="link" fullWidth className="text-[#34C759] !font-semibold" onClick={() => router.push('/guest-details')}>
          Continue as Guest
        </Button>
      </form>
    </AuthPageLayout>
  );
};

export default SignInPage;