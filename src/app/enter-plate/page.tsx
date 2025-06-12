"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import AppLayout from '@/components/layout/AppLayout';
import Button from '@/components/ui/Button';
import PlateInput from '@/components/ui/PlateInput';
import { endSession } from '@/store/slice/parking';
import { RootState } from '@/store/store';
// import { endSession } from '@/redux/slices/parkingSlice'; // Import the new thunk
// import { RootState } from '@/redux/store'; // Adjust path to your store

const EnterPlatePage: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<any>();
  const [activeTab, setActiveTab] = useState<'Home' | 'Wallet' | 'History' | 'Profile'>('Home');
  const [plateNumber, setPlateNumber] = useState('');
  const { isLoading, error } = useSelector((state: RootState) => state.parking);

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

  const handleEndSession = () => {
    // if (plateNumber.length === plateLength) {
      
    // } else {
    //   alert(`Please enter a complete ${plateLength}-character plate number.`);
    // }
    try {
      const result = dispatch(endSession(plateNumber)).unwrap();
      console.log('Session ended successfully:', result);
    
    // Redirect to payment confirmation or summary page
    router.push('/parking-leave-session');
    }catch (error) {
    console.error('Failed to end session:', error);

  }
    
  };

  return (
    <AppLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      headerProps={{
        onBack: () => router.back(),
        showBackButton: true,
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
            initialChars={initialPlateChars}
            name="plate-input"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        <Button
          variant="primary"
          onClick={handleContinue}
          fullWidth
          className="max-w-md text-base sm:text-lg py-3 mb-4"
          // disabled={plateNumber.length !== plateLength || isLoading}
        >
          Continue
        </Button>

        <Button
          variant="secondary"
          onClick={handleEndSession}
          fullWidth
          className="max-w-md text-base sm:text-lg py-3"
          // disabled={plateNumber.length !== plateLength || isLoading}
        >
          {isLoading ? 'Ending Session...' : 'End Session'}
        </Button>
      </div>
    </AppLayout>
  );
};

export default EnterPlatePage;