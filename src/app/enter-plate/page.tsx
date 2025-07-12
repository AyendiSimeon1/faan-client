"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import AppLayout from '@/components/layout/AppLayout';
import Button from '@/components/ui/Button';
import { endSession } from '@/store/slice/parking';
import { RootState } from '@/store/store';

const EnterPlatePage: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<any>();
  const [activeTab, setActiveTab] = useState<'Home' | 'Wallet' | 'History' | 'Payments'>('Home');
  const [secureId, setSecureId] = useState('');
  const { isLoading, error } = useSelector((state: RootState) => state.parking);

  const secureIdLength = 4; // Secure ID is now 4 digits

  const handleSecureIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSecureId(e.target.value);
  };

  const handleContinue = () => {
    if (secureId.length === secureIdLength) {
      console.log('Entered Secure ID:', secureId);
      alert(`Secure ID: ${secureId} - Continue (Simulated)`);
    } else {
      alert(`Please enter a complete ${secureIdLength}-character Secure ID.`);
    }
  };

  const handleEndSession = async () => {
    try {
      await dispatch(endSession(secureId)).unwrap();
      router.push('/parking-leave-session');
    } catch (err) {
      console.error('Failed to end session:', err);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md flex flex-col items-center">
        <p className="text-base sm:text-lg text-center text-[#2C2C2E] font-medium mb-6">
          Enter Secure ID
        </p>
        <div className="w-full mb-8">
          <input
            type="text"
            value={secureId}
            onChange={handleSecureIdChange}
            maxLength={secureIdLength}
            pattern="[0-9]{4}"
            inputMode="numeric"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FDB813]"
            placeholder={`Enter ${secureIdLength}-digit Secure ID`}
            name="secure-id-input"
          />
        </div>
        {error && (
          <p className="text-red-500 tsext-sm mb-4 text-center">{error}</p>
        )}
        <div className="w-full flex flex-col gap-4">
          <Button
            variant="primary"
            onClick={handleEndSession}
            fullWidth
            className="text-base py-3 bg-gray-200"
            disabled={isLoading || secureId.length !== secureIdLength}
          >
            {isLoading ? 'Ending Session...' : 'End Session'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EnterPlatePage;