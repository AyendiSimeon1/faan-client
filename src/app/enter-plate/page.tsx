"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import Button from '@/components/ui/Button';
import PlateInput from '@/components/ui/PlateInput';


const EnterPlatePage: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'Home' | 'Wallet' | 'History' | 'Profile'>('Home'); // Or derive from router
  const [plateNumber, setPlateNumber] = useState('');
  
  // Mockup shows "A B J 2 9 0 E L" - this is 8 characters
  const plateLength = 8;
  const initialPlateChars = ['A', 'B', 'J', '2', '9', '0', 'E', 'L'];


  const handlePlateChange = (newPlate: string) => {
    setPlateNumber(newPlate);
  };

  const handleContinue = () => {
    if (plateNumber.length === plateLength) {
      console.log('Entered Plate Number:', plateNumber);
      alert(`Plate Number: ${plateNumber} - Continue (Simulated)`);
      // router.push(`/parking/session-details?plate=${plateNumber}`);
    } else {
      alert(`Please enter a complete ${plateLength}-character plate number.`);
    }
  };

  return (
    <AppLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      headerProps={{
        onBack: () => router.back(),
        showBackButton: true,
        // title: "Enter Plate Number" // Title is in the body in mockup
      }}
      containerClassName="max-w-xl mx-auto flex flex-col items-center justify-center h-full pt-0"
    >
       <div className="flex flex-col items-center justify-center flex-grow w-full p-4 sm:p-6">
        <p className="text-base sm:text-lg text-[#2C2C2E] font-medium mb-4 sm:mb-6">
          Enter plate number
        </p>
        
        <div className="mb-8 sm:mb-10">
          <PlateInput
            length={plateLength}
            onChange={handlePlateChange}
            initialChars={initialPlateChars} // Pre-fill with mockup values
            name="plate-input"
          />
        </div>

        <Button 
          variant="primary" 
          onClick={handleContinue} 
          fullWidth 
          className="max-w-md text-base sm:text-lg py-3"
          disabled={plateNumber.length !== plateLength}
        >
          Continue
        </Button>
      </div>
    </AppLayout>
  );
};

export default EnterPlatePage;