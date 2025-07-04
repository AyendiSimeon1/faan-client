"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import AppLayout from '@/components/layout/AppLayout';
import Button from '@/components/ui/Button';
import PlateInput from '@/components/ui/PlateInput';
import { endSession } from '@/store/slice/parking';
import { RootState } from '@/store/store';

const EnterPlatePage: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<any>();
  const [activeTab, setActiveTab] = useState<'Home' | 'Wallet' | 'History' | 'Payments'>('Home');
  const [plateNumber, setPlateNumber] = useState('');
  const { isLoading, error } = useSelector((state: RootState) => state.parking);

  const plateLength = 8;
  // const initialPlateChars = ['A', 'B', 'J', '2', '9', '0', 'E', 'L'];

  const handlePlateChange = (newPlate: string) => {
    setPlateNumber(newPlate);
  };

  const handleContinue = () => {
    if (plateNumber.length === plateLength) {
      console.log('Entered Plate Number:', plateNumber);
      alert(`Plate Number: ${plateNumber} - Continue (Simulated)`);
    } else {
      alert(`Please enter a complete ${plateLength}-character plate number.`);
    }
  };

  const handleEndSession = async () => {
    try {
      await dispatch(endSession(plateNumber)).unwrap();
      router.push('/parking-leave-session');
    } catch (err) {
      console.error('Failed to end session:', err);
    }
  };

  return (
    // <AppLayout
    //   activeTab={activeTab}
    //   onTabChange={setActiveTab}
    //   headerProps={{
    //     onBack: () => router.back(),
    //     showBackButton: true,
    //   }}
    // >
      <div className="w-full h-full flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md flex flex-col items-center">
          <p className="text-base sm:text-lg text-center text-[#2C2C2E] font-medium mb-6">
            Enter plate number
          </p>

          <div className="w-full mb-8">
            <PlateInput
              length={plateLength}
              onChange={handlePlateChange}
              // initialChars={initialPlateChars}
              name="plate-input"
            />
          </div>

          {error && (
            <p className="text-red-500 tsext-sm mb-4 text-center">{error}</p>
          )}

          <div className="w-full flex flex-col gap-4">
            {/* <Button
              variant="primary"
              onClick={handleContinue}
              fullWidth
              className="text-base py-3"
              disabled={plateNumber.length !== plateLength || isLoading}
            >
              Continue
            </Button> */}

            <Button
              variant="primary"
              onClick={handleEndSession}
              fullWidth
              className="text-base py-3 bg-gray-200"
              disabled={ isLoading}
            >
              {isLoading ? 'Ending Session...' : 'End Session'}
            </Button>
          </div>
        </div>
      </div>
    // </AppLayout>
  );
};

export default EnterPlatePage;