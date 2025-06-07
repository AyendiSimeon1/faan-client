"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AppLayout from '../../components/layout/AppLayout';
import Button from '../../components/ui/Button';
import { CloseIcon, GreenCheckSmallIcon } from '@/components/ui/Icon';

// Placeholder car illustration
const CarIllustration = () => (
  <div className="w-full max-w-xs sm:max-w-sm mx-auto my-6 sm:my-8">
    <svg viewBox="0 0 200 100" className="w-full h-auto">
        <rect x="10" y="50" width="180" height="40" rx="10" fill="#FDB813"/>
        <rect x="30" y="30" width="140" height="30" rx="5" fill="#E0A00A"/>
        <circle cx="50" cy="90" r="10" fill="#555"/>
        <circle cx="150" cy="90" r="10" fill="#555"/>
        <rect x="40" y="35" width="40" height="20" fill="#AACCFF"/>
        <rect x="120" y="35" width="40" height="20" fill="#AACCFF"/>
         {/* Simple person shape */}
        <circle cx="90" cy="40" r="10" fill="#6c5ce7" /> 
        <rect x="80" y="45" width="20" height="20" fill="#6c5ce7" />
    </svg>
  </div>
);

const AutoDebitLeavePage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'Home' | 'Wallet' | 'History' | 'Profile'>('Home');
  const [isLoading, setIsLoading] = useState(false); // Start as false, trigger loading on action

  // Simulate loading from query param or initial action for mockup visual
  useEffect(() => {
    if (searchParams.get('loading') === 'true') {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 3000); // Simulate loading time
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const handleLeave = () => {
    setIsLoading(true);
    console.log("Processing 'I'm Leaving Now'...");
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert("Payment successful! (Simulated)");
      router.push('/home'); // Or to a payment success screen
    }, 2500);
  };

  const sessionDetails = {
    plateNumber: "ABJ246EL",
    entryTime: "12:05 PM",
    duration: "1h 42m",
    fee: "₦1,700",
    status: "Auto-Debit Enabled",
    paymentMethod: "Wallet ••••0231",
  };

  const AutoDebitHeader = () => (
    <header className="bg-white p-4 sm:p-6 flex items-center justify-between relative border-b border-neutral-200">
       <div className="flex-1"></div> {/* Spacer to center title if no back button */}
      <h1 className="text-lg sm:text-xl font-semibold text-[#2C2C2E] text-center flex-1">Ready to Leave?</h1>
      <div className="flex-1 flex justify-end">
        <button onClick={() => router.back()} className="p-2">
          <CloseIcon />
        </button>
      </div>
    </header>
  );

  return (
    <AppLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      customHeader={<AutoDebitHeader />}
      hideHeader={false} // We use customHeader which is not hidden
      containerClassName="max-w-2xl mx-auto flex flex-col items-center justify-center"
    >
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl w-full text-center">
        <CarIllustration />
        
        <div className="space-y-3 text-left mb-6 sm:mb-8 text-sm sm:text-base">
          <div className="flex justify-between">
            <span className="text-[#8A8A8E]">Plate Number</span>
            <span className="font-medium text-[#2C2C2E]">{sessionDetails.plateNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8A8A8E]">Entry Time</span>
            <span className="font-medium text-[#2C2C2E]">{sessionDetails.entryTime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8A8A8E]">Duration</span>
            <span className="font-medium text-[#2C2C2E]">{sessionDetails.duration}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8A8A8E]">Fee</span>
            <span className="font-medium text-[#2C2C2E]">{sessionDetails.fee}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8A8A8E]">Status</span>
            <span className="font-medium text-[#2C2C2E]">
              {sessionDetails.status}
              <GreenCheckSmallIcon />
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8A8A8E]">Payment Method</span>
            <span className="font-medium text-[#2C2C2E]">{sessionDetails.paymentMethod}</span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-3">
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[#8A8A8E]">Processing your exit...</p>
          </div>
        ) : (
          <Button variant="primary" fullWidth onClick={handleLeave}>
            I'm Leaving Now
          </Button>
        )}
      </div>
    </AppLayout>
  );
};

export default AutoDebitLeavePage;