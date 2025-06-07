"use client";
import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import ScreenHeader from '../../components/ui/ScreenHeader';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { forgotPassword } from '@/store/slice/auth';

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPasswordPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isValid } } = useForm<ForgotPasswordFormData>({
    mode: 'onChange', // To enable success tick
    defaultValues: { email: "joymiracle@gmail.com" }
  });
  const router = useRouter();
  const dispatch = useAppDispatch();

  const onSubmit: SubmitHandler<ForgotPasswordFormData> = (data) => {
    console.log('i am submitting')
    dispatch(forgotPassword(data));
    
    router.push('/otp-page'); 
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 selection:bg-[#FDB813] selection:text-black">
      <ScreenHeader onBack={() => router.back()} showBackButton={true} />
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white p-6 sm:p-10 rounded-xl shadow-xl">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#2C2C2E] mb-2">Forgot password!</h1>
            <p className="text-sm text-[#8A8A8E]">
              We'll send you a link to the email address you signed up with.
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input<ForgotPasswordFormData>
              name="email"
              label="Email"
              type="email"
              placeholder="joymiracle@gmail.com"
              register={register}
              error={errors.email}
              
              showSuccessTick={isValid && !errors.email}
            />
            <Button type="submit" variant="primary" fullWidth>
              Continue
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;