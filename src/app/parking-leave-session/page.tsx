"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AppLayout from '../../components/layout/AppLayout';
import Button from '../../components/ui/Button';
import Link from 'next/link';
import { CloseIcon, CarWithCityIllustration, GreenCheckSmallIcon, LargeSuccessTickIcon } from '@/components/ui/Icon';

type LeaveSessionState = 'confirm' | 'loading' | 'success';

const LeaveSessionPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'Home' | 'Wallet' | 'History' | 'Profile'>('Home');
  const [pageState, setPageState] = useState<LeaveSessionState>('confirm');

  // Example session data
  const sessionDetails = {
    plateNumber: "ABJ246EL",
    entryTime: "12:05 PM",
    duration: "1h 42m",
    fee: "₦1,700",
    status: "Auto-Debit Enabled",
    paymentMethod: "Wallet ••••0231",
  };

  useEffect(() => {
    const state = searchParams.get('state');
    if (state === 'loading') {
      setPageState('loading');
      const timer = setTimeout(() => setPageState('success'), 3000);
      return () => clearTimeout(timer);
    } else if (state === 'success') {
      setPageState('success');
    } else {
      setPageState('confirm');
    }
  }, [searchParams]);

  const handleLeaveNow = () => {
    setPageState('loading');
    console.log("Processing 'I'm Leaving Now'...");
    setTimeout(() => {
      setPageState('success');
    }, 2500);
  };

  const SessionDetailCard = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-8 mb-8">
      <h3 className="text-xl font-semibold text-neutral-800 mb-6 flex items-center">
        <span className="w-2 h-2 bg-[#FDB813] rounded-full mr-3"></span>
        Session Summary
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { label: "Plate Number", value: sessionDetails.plateNumber, important: true },
          { label: "Entry Time", value: sessionDetails.entryTime },
          { label: "Duration", value: sessionDetails.duration, important: true },
          { label: "Total Fee", value: sessionDetails.fee, important: true },
          { 
            label: "Payment Status", 
            value: (
              <div className="flex items-center space-x-2">
                <span>{sessionDetails.status}</span>
                <GreenCheckSmallIcon />
              </div>
            )
          },
          { label: "Payment Method", value: sessionDetails.paymentMethod },
        ].map(item => (
          <div key={item.label} className={`p-4 rounded-xl border transition-all duration-200 ${
            item.important 
              ? 'border-[#FDB813] bg-gradient-to-br from-amber-50 to-orange-50' 
              : 'border-neutral-200 bg-neutral-50'
          }`}>
            <div className="text-sm font-medium text-neutral-600 mb-1">{item.label}</div>
            <div className={`font-semibold ${item.important ? 'text-lg text-neutral-800' : 'text-neutral-700'}`}>
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const LoadingState = () => (
    <div className="text-center py-12">
      <div className="relative mb-8">
        <div className="w-24 h-24 mx-auto border-4 border-green-200 border-t-green-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <CarWithCityIllustration  />
          </div>
        </div>
      </div>
      <h3 className="text-2xl font-semibold text-neutral-800 mb-3">Processing Your Exit</h3>
      <p className="text-neutral-600 mb-8 max-w-md mx-auto">
        Please wait while we process your payment and prepare your exit confirmation...
      </p>
      <div className="max-w-md mx-auto">
        <Button variant="primary" fullWidth disabled className="opacity-50 cursor-not-allowed">
          <span className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Processing...
          </span>
        </Button>
      </div>
    </div>
  );

  const SuccessState = () => (
    <div className="text-center py-16">
      <div className="mb-8 relative">
        <div className="w-32 h-32 mx-auto bg-gradient-to-br from-green-50 to-emerald-50 rounded-full flex items-center justify-center border-4 border-green-200">
          <LargeSuccessTickIcon  />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full animate-ping opacity-75"></div>
      </div>
      
      <h2 className="text-4xl font-bold text-neutral-800 mb-4">Payment Successful!</h2>
      <p className="text-xl text-neutral-600 mb-2">Exit gate is now open</p>
      <p className="text-neutral-500 mb-12 max-w-lg mx-auto">
        You may now exit the parking lot. Thank you for choosing our parking service. Have a safe drive! 🎉
      </p>

      {/* Success Actions */}
      <div className="max-w-md mx-auto space-y-4">
        <Button 
          variant="primary" 
          fullWidth 
          onClick={() => alert("Download Receipt Clicked!")} 
          className="text-lg py-4 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          📄 Download Receipt
        </Button>
        <Link href="/history/sessions" passHref>
          <Button 
            variant="tertiary" 
            fullWidth 
            className="text-lg py-4 border-2 hover:bg-neutral-50"
          >
            📊 View Parking History
          </Button>
        </Link>
        <Button 
          variant="tertiary" 
          fullWidth 
          onClick={() => router.push('/home')}
          className="text-base py-3 text-neutral-600 hover:text-neutral-800"
        >
          ← Back to Dashboard
        </Button>
      </div>
    </div>
  );

  const ConfirmState = () => (
    <div className="max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-neutral-800 mb-4">Ready to Leave?</h1>
        <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
          Review your parking session details and confirm your exit when you're ready to leave
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Left Column - Illustration */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-md mb-8">
            <CarWithCityIllustration />
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
            <h4 className="font-semibold text-neutral-800 mb-2">💡 Quick Tip</h4>
            <p className="text-sm text-neutral-600">
              Make sure you're near your vehicle before confirming exit. The gate will open for 5 minutes.
            </p>
          </div>
        </div>

        {/* Right Column - Session Details & Actions */}
        <div>
          <SessionDetailCard />
          
          {/* Action Section */}
          <div className="bg-gradient-to-br from-[#FDB813] to-orange-400 rounded-2xl p-8 text-white shadow-lg">
            <h3 className="text-2xl font-bold mb-4">Ready to Exit?</h3>
            <p className="mb-6 opacity-90">
              Click below when you're ready to leave. Payment will be processed automatically.
            </p>
            <Button 
              variant="primary" 
              fullWidth 
              onClick={handleLeaveNow}
              className="bg-white text-[#FDB813] hover:bg-neutral-50 text-lg py-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              🚗 I'm Leaving Now
            </Button>
            <p className="text-sm mt-4 opacity-75 text-center">
              Gate will open automatically after confirmation
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (pageState) {
      case 'confirm':
        return <ConfirmState />;
      case 'loading':
        return <LoadingState />;
      case 'success':
        return <SuccessState />;
    }
  };

  return (
    <AppLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      hideHeader={pageState === 'success'} // Hide header on success for cleaner look
      containerClassName="py-8"
    >
      {/* Custom Header for non-success states */}
      {pageState !== 'success' && (
        <div className="flex justify-end mb-6">
          <button 
            onClick={() => router.push('/home')} 
            className="p-3 hover:bg-neutral-100 rounded-full transition-colors"
          >
            <CloseIcon  />
          </button>
        </div>
      )}
      
      {renderContent()}
    </AppLayout>
  );
};

export default LeaveSessionPage;