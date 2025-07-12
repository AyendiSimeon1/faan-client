"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '../../components/layout/AppLayout';
import Button from '../../components/ui/Button';
import { CarIconSmall, ClockIcon, MoneyIcon } from '@/components/ui/Icon';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useParkingFee } from '@/hooks/useParkingFee';
import { VEHICLE_TYPES } from '@/utils/parkingFeeCalculator';
import { updateLiveDuration } from '@/store/slice/parking';

const ParkingSessionPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<'Home' | 'Wallet' | 'History' | 'Payments'>('Home');
  const [isClient, setIsClient] = useState(false);
  const { activeSession, isLoading, error } = useAppSelector((state) => state.parking);
  


  // Handle client-side mounting
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    if (!activeSession?.data) {
      router.replace('/parking'); // Redirect if no active session
    }
  }, [activeSession, router, isClient]);

  const InfoCard: React.FC<{ 
    title: string; 
    children: React.ReactNode; 
    icon?: React.ReactNode;
    titleColor?: string;
    highlight?: boolean;
  }> = ({ title, children, icon, titleColor = "text-neutral-700", highlight = false }) => (
    <div className={`bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 transition-all duration-200 hover:shadow-md ${
      highlight ? 'ring-2 ring-[#FDB813] ring-opacity-20 bg-gradient-to-br from-white to-amber-50' : ''
    }`}>
      <div className={`flex items-center mb-4 text-base font-semibold ${titleColor}`}>
        {icon && <span className="mr-3 text-xl">{icon}</span>}
        {title}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );

  const DetailRow: React.FC<{ 
    label: string; 
    value: string | React.ReactNode; 
    valueClassName?: string;
    important?: boolean;
  }> = ({ label, value, valueClassName = "text-neutral-800 font-medium", important = false }) => (
    <div className={`flex justify-between items-center py-2 ${important ? 'border-t border-neutral-100 pt-4' : ''}`}>
      <span className="text-neutral-600 font-medium">{label}</span>
      <span className={`${valueClassName} ${important ? 'text-lg' : ''}`}>{value}</span>
    </div>
  );

  const LiveTimer: React.FC = () => {
    const [duration, setDuration] = useState('00:00:00');

    useEffect(() => {
      if (!activeSession?.data?.entryTime) return;

      const updateDuration = () => {
        const entryTime = new Date(activeSession.data.entryTime);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - entryTime.getTime()) / 1000);
        
        const hours = Math.floor(diffInSeconds / 3600);
        const minutes = Math.floor((diffInSeconds % 3600) / 60);
        const seconds = diffInSeconds % 60;
        
        const newDuration = [hours, minutes, seconds]
          .map(n => n.toString().padStart(2, '0'))
          .join(':');
        
        setDuration(newDuration);
        // Calculate and update the fee in the store
        dispatch(updateLiveDuration(diffInSeconds.toString()));
      };

      // Update immediately
      updateDuration();

      // Then update every second
      const interval = setInterval(updateDuration, 1000);

      return () => clearInterval(interval);
    }, [activeSession?.data?.entryTime, dispatch]);

    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-700 font-medium">Live Session</span>
          </div>
          <div className="text-2xl font-mono font-bold text-green-800">
            {duration}
          </div>
        </div>
      </div>
    );
  };

  // Get live fee calculation
  const parkingFee = useParkingFee(
    activeSession?.data?.vehicleType || VEHICLE_TYPES.REGULAR,
    activeSession?.data?.entryTime ? new Date(activeSession.data.entryTime) : new Date(),
    30000 // Update every 30 seconds
  );

  const [showRateDetails, setShowRateDetails] = useState(false);
    console.log('an active sessions', activeSession);

  // Rate details component
  const RateDetails: React.FC = () => (
    <div className="mt-4 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
      <h4 className="font-semibold mb-2">Rate Details</h4>
      <div className="space-y-2 text-sm">
        <p className="flex justify-between">
          <span className="text-neutral-600">First Hour</span>
          <span className="font-medium">₦1,000 - ₦1,500</span>
        </p>
        <p className="flex justify-between">
          <span className="text-neutral-600">Hours 2-4</span>
          <span className="font-medium">₦100/30min</span>
        </p>
        <p className="flex justify-between">
          <span className="text-neutral-600">After 4 Hours</span>
          <span className="font-medium">₦500/hour</span>
        </p>
        <p className="flex justify-between">
          <span className="text-neutral-600">Overnight (12+ hours)</span>
          <span className="font-medium">₦5,000 flat</span>
        </p>
      </div>
    </div>
  );

  // Don't render until client-side mounting is complete
  if (!isClient) {
    return null;
  }

  // Show loading state if still loading or no active session
  if (isLoading || !activeSession?.data) {
    return (
      <AppLayout
        activeTab={activeTab}
        onTabChange={setActiveTab}
        headerProps={{ onBack: () => router.back(), showBackButton: true }}
        containerClassName="max-w-4xl mx-auto"
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#FDB813] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-600">Loading parking session...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      headerProps={{ onBack: () => router.back(), showBackButton: true }}
      containerClassName="max-w-4xl mx-auto"
    >
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-neutral-800 mb-2">
          Active Parking Session
        </h1>
        <p className="text-neutral-600 text-lg">
          Monitor your current parking session and manage payment
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Left Column - Session Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Live Timer Card - Prominent */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
            <h2 className="text-xl font-semibold text-neutral-800 mb-4 flex items-center">
              <ClockIcon />
              Session Duration
            </h2>
            <LiveTimer />
            <div className="mt-4 text-sm text-neutral-600">
              Started at {activeSession.data?.entryTime ? new Date(activeSession.data.entryTime).toLocaleString() : '-'}
            </div>
          </div>

          {/* Vehicle Information */}
          <InfoCard title="Vehicle Information" icon={<CarIconSmall />}>
            <DetailRow label="Plate Number" value={activeSession.data?.vehiclePlateNumber || '-'} />
            <DetailRow label="Vehicle Type" value={activeSession.data?.vehicleType || '-'} />
            <DetailRow label="Secure Id" value={activeSession.data?.secureId || '-'} />
          </InfoCard>

        </div>

        {/* Right Column - Payment & Status */}
        <div className="space-y-6">
          {/* Current Fee Card - Highlighted */}
          <InfoCard title="Current Fee" icon={<MoneyIcon />} highlight={true}>
            <DetailRow 
              label="Amount Due" 
              value={parkingFee.formattedFee}
              valueClassName="text-2xl font-bold text-[#FDB813]"
              important={true}
            />
            <DetailRow 
              label="Vehicle Type Rate" 
              value={activeSession.data?.vehicleType === VEHICLE_TYPES.SUV_BUS ? "SUV/Bus Rate" : "Regular Rate"}
              valueClassName="text-neutral-600"
            />
            <div className="pt-3">
              <button 
                onClick={() => setShowRateDetails(!showRateDetails)}
                className="text-[#FDB813] hover:text-[#E0A00A] font-medium text-sm hover:underline transition-colors"
              >
                {showRateDetails ? "Hide Rate Details ↑" : "View Rate Details →"}
              </button>
            </div>
            {showRateDetails && <RateDetails />}
          </InfoCard>

          {/* Session Status */}
          <InfoCard title="Session Status">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-700 font-semibold text-lg">
                  {activeSession?.status || 'Unknown'}
                </span>
              </div>
              <div className="text-green-600 text-sm font-medium">
                {activeSession?.status === 'Active' ? 'Session Running' : 'Session Status'}
              </div>
            </div>
          </InfoCard>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              fullWidth 
              onClick={() => router.push('/parking/leave-session')}
              className="text-lg py-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Pay & Exit Session
            </Button>
            
            <Button 
              fullWidth 
              onClick={() => router.push('/parking/extend-session')}
              className="text-base py-3 border-2 hover:bg-neutral-50"
            >
              Extend Session
            </Button>
          </div>

        </div>
      </div>

      {/* Quick Actions Footer */}
      <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-200">
        <h3 className="font-semibold text-neutral-800 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-white rounded-lg border border-neutral-200 hover:border-neutral-300 text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors">
            Download Receipt
          </button>
          <button className="px-4 py-2 bg-white rounded-lg border border-neutral-200 hover:border-neutral-300 text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors">
            View Parking Rules
          </button>
          <button className="px-4 py-2 bg-white rounded-lg border border-neutral-200 hover:border-neutral-300 text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors">
            Contact Support
          </button>
        </div>
      </div>

    </AppLayout>
  );
};

export default ParkingSessionPage;