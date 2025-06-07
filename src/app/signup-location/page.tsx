"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../../components/ui/Button';
import AuthPageLayout from '@/components/layout/AuthLayout';

const locations = ["Abia", "Adamawa", "Abuja", "Port Harcourt", "Jos", "Zamfara"];

const SignUpLocationPage: React.FC = () => {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState<string | null>("Abuja");

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
  };

  const handleContinue = () => {
    if (selectedLocation) {
      console.log("Selected location:", selectedLocation);
      router.push('/auth/sign-up');
    }
  };

  return (
    <AuthPageLayout
      headerProps={{
        title: "Hi There!",
        onBack: () => router.back(),
        showBackButton: true,
        titleClassName: '!text-left !text-2xl lg:!text-3xl !font-bold pl-0',
      }}
      cardClassName="w-full max-w-2xl lg:max-w-4xl"
    >
      <div className="text-center mb-6">
        <h1 className="text-xl lg:text-2xl font-bold text-[#2C2C2E]">
          Where are you registering from?
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 px-2 sm:px-0">
        {locations.map((location) => (
          <button
            key={location}
            type="button"
            onClick={() => handleLocationSelect(location)}
            className={`text-left p-4 rounded-lg border transition-all duration-150
              ${
                selectedLocation === location
                  ? 'bg-white border-2 border-[#FDB813] text-[#2C2C2E] font-semibold shadow-md'
                  : 'bg-neutral-50 border border-neutral-200 text-[#2C2C2E] hover:bg-neutral-100'
              }`}
          >
            {location}
          </button>
        ))}
      </div>

      <div className="text-center mb-6">
        <a href="#" className="text-sm font-medium text-[#2C2C2E] hover:text-[#FDB813] underline">
          Show all
        </a>
      </div>

      <div className="w-full max-w-sm mx-auto">
        <Button onClick={handleContinue} variant="primary" fullWidth disabled={!selectedLocation}>
          Continue
        </Button>
      </div>
    </AuthPageLayout>
  );
};

export default SignUpLocationPage;
