"use client";
import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import AuthPageLayout from '@/components/layout/AuthLayout';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { signupUser } from '@/store/slice/auth';

interface SignUpFormData {
  name: string;
  phoneNumber: string;
  email: string;
  plateNumber: string;
  password_field: string;
}

const SignUpPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormData>({
    defaultValues: { email: "joymiracle@gmail.com" }
  });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const onSubmit: SubmitHandler<SignUpFormData> = (data) => {
    dispatch(signupUser(data));
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/home');
    }
  }, [isAuthenticated, router]);

  return (
    <AuthPageLayout
      headerProps={{
        onBack: () => router.back(),
        showBackButton: true,
      }}
      cardClassName="w-full max-w-7xl px-2 py-2" // Increased padding for desktop
    >
      {/* Header Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-[#2C2C2E] mb-4">
          Create Your Driver Profile
        </h1>
        <p className="text-lg text-[#8A8A8E]">
          Save time on future visits and enable auto-pay <span role="img" aria-label="car">🚗</span>
        </p>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-5xl mx-auto">
        <div className="grid grid-cols-2 gap-x-12 gap-y-6">
          {/* Left Column */}
          <div className="space-y-6">
            <Input<SignUpFormData>
              name="name"
              label="Name"
              type="text"
              placeholder="Joy Miracle"
              register={register}
              error={errors.name}
            />
            <Input<SignUpFormData>
              name="phoneNumber"
              label="Phone Number"
              type="tel"
              placeholder="07030678890"
              register={register}
              error={errors.phoneNumber}
            />
            <Input<SignUpFormData>
              name="plateNumber"
              label="Plate Number"
              type="text"
              placeholder="Abuja5639BJ"
              register={register}
              error={errors.plateNumber}
              className="uppercase"
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Input<SignUpFormData>
              name="email"
              label="Email"
              type="email"
              placeholder="joymiracle@gmail.com"
              register={register}
              error={errors.email}
            />
            <Input<SignUpFormData>
              name="password_field"
              label="Password"
              type="password"
              placeholder="Enter your password"
              register={register}
              error={errors.password_field}
            />
          </div>
        </div>

        {/* Button Section */}
        <div className="mt-12 flex justify-center">
          <Button type="submit" variant="primary" className="px-16 py-4 text-lg">
            Register
          </Button>
        </div>
      </form>
    </AuthPageLayout>
  );
};

export default SignUpPage;