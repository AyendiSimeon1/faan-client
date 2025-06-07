"use client";
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import AuthPageLayout from '@/components/layout/AuthLayout';

interface GuestFormData {
  name: string;
  phoneNumber: string;
  email: string;
  plateNumber: string;
}

const GuestDetailsPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<GuestFormData>({
    defaultValues: { // Pre-filled from mockup
        name: "Joy Miracle",
        phoneNumber: "07030678890",
        email: "joymiracle@gmail.com",
        plateNumber: "Abuja25098",
    }
  });
  const router = useRouter();

  const onSubmit: SubmitHandler<GuestFormData> = (data) => {
    console.log(data);
    // router.push('/payment'); // Example navigation
  };

  return (
    <AuthPageLayout
      headerProps={{
        onBack: () => router.back(),
        showBackButton: false,
      }}
    //   cardClassName="max-w-md"
    >
      <div className="text-left mb-6">
        <h1 className="text-2xl font-bold text-[#2C2C2E] mb-1">Guest User</h1>
        <p className="text-sm text-[#8A8A8E]">
          Save your plate number, speed up payments, and access your parking history all in one place.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input<GuestFormData>
          name="name"
          label="Name"
          type="text"
          placeholder="Joy Miracle"
          register={register}
          error={errors.name}
        //   rules={{ required: 'Name is required' }}
        />
        <Input<GuestFormData>
          name="phoneNumber"
          label="Phone Number"
          type="tel"
          placeholder="07030678890"
          register={register}
          error={errors.phoneNumber}
        //   rules={{ required: 'Phone number is required' }}
        />
        <Input<GuestFormData>
          name="email"
          label="Email"
          type="email"
          placeholder="joymiracle@gmail.com"
          register={register}
          error={errors.email}
        //   rules={{ required: 'Email is required' }}
        />
        <Input<GuestFormData>
          name="plateNumber"
          label="Plate Number"
          type="text"
          placeholder="Abuja25098"
          register={register}
          error={errors.plateNumber}
        //   rules={{ required: 'Plate number is required' }}
          className="uppercase"
        />
        <div className="pt-2">
          <Button type="submit" variant="primary" fullWidth>
            Make Payment
          </Button>
        </div>
      </form>
    </AuthPageLayout>
  );
};

export default GuestDetailsPage;