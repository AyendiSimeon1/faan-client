"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import Button from '@/components/ui/Button';
import { CloseIcon, LargeSuccessTickIcon, DownloadIcon } from '@/components/ui/Icon';

const PaymentSuccessfulPage: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'Home' | 'Wallet' | 'History' | 'Profile'>('Wallet');

  const receiptDetails = {
    amountPaid: "₦1,600",
    transactionId: "63539742134450353",
    paymentDate: "May 13, 2025",
    paymentMethod: "Visa ••••••••890",
  };

  const PaymentSuccessHeader = () => (
    <div className="px-6 lg:px-8 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="text-2xl font-bold text-[#FDB813]">FAAN</div>
        <div className="h-6 w-px bg-neutral-300"></div>
        <div className="text-lg font-medium text-neutral-700">Payment Confirmation</div>
      </div>
      <button 
        onClick={() => router.push('/home')} 
        className="p-2 hover:bg-neutral-100 rounded-lg transition-colors duration-200"
      >
        <CloseIcon />
      </button>
    </div>
  );
  
  // Wavy separator using SVG
  const WavySeparator = () => (
    <svg viewBox="0 0 100 5" className="w-full h-2 my-3 text-neutral-300" preserveAspectRatio="none">
      <path d="M0,2.5 Q2.5,0 5,2.5 T10,2.5 Q12.5,5 15,2.5 T20,2.5 Q22.5,0 25,2.5 T30,2.5 Q32.5,5 35,2.5 T40,2.5 Q42.5,0 45,2.5 T50,2.5 Q52.5,5 55,2.5 T60,2.5 Q62.5,0 65,2.5 T70,2.5 Q72.5,5 75,2.5 T80,2.5 Q82.5,0 85,2.5 T90,2.5 Q92.5,5 95,2.5 T100,2.5" 
        stroke="currentColor" strokeWidth="0.5" fill="none"/>
    </svg>
  );

  return (
    <AppLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      customHeader={<PaymentSuccessHeader />}
      containerClassName="flex items-center justify-center min-h-full"
    >
      <div className="w-full max-w-2xl mx-auto">
        {/* Main Success Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden">
          {/* Success Icon and Message */}
          <div className="px-8 lg:px-12 py-12 lg:py-16 text-center border-b border-neutral-100">
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-green-50 rounded-full">
                <LargeSuccessTickIcon />
              </div>
            </div>
            
            <h1 className="text-3xl lg:text-4xl font-bold text-neutral-800 mb-4">
              Payment Successful!
            </h1>
            <p className="text-lg text-neutral-600 max-w-md mx-auto leading-relaxed">
              Thank you! Your payment was successfully processed 🤗
            </p>
          </div>

          {/* Receipt Section */}
          <div className="px-8 lg:px-12 py-8 lg:py-10">
            <h2 className="text-xl font-semibold text-neutral-800 mb-6">Transaction Details</h2>
            
            {/* Primary Details Card */}
            <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 rounded-xl p-6 lg:p-8 mb-6">
              <div className="flex justify-between items-center py-3">
                <span className="text-neutral-600 font-medium">Amount Paid</span>
                <span className="text-2xl font-bold text-neutral-800">{receiptDetails.amountPaid}</span>
              </div>
              <WavySeparator />
              <div className="flex justify-between items-center py-3">
                <span className="text-neutral-600 font-medium">Transaction ID</span>
                <span className="text-neutral-800 font-mono text-sm bg-white px-3 py-1 rounded-md break-all">
                  {receiptDetails.transactionId}
                </span>
              </div>
            </div>

            {/* Secondary Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white border border-neutral-200 rounded-lg p-4 lg:p-6">
                <div className="text-sm text-neutral-500 mb-1">Payment Date</div>
                <div className="text-lg font-semibold text-neutral-800">{receiptDetails.paymentDate}</div>
              </div>
              <div className="bg-white border border-neutral-200 rounded-lg p-4 lg:p-6">
                <div className="text-sm text-neutral-500 mb-1">Payment Method</div>
                <div className="text-lg font-semibold text-neutral-800">{receiptDetails.paymentMethod}</div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="secondary" 
                onClick={() => alert("Download Receipt Clicked!")}
                className="flex-1 text-base lg:text-lg py-3 px-6 border-neutral-300 hover:border-neutral-400 transition-colors duration-200 flex items-center justify-center"
              >
                <DownloadIcon  />
                Download Receipt
              </Button>
              <Button 
                variant="primary" 
                onClick={() => router.push('/home')}
                className="flex-1 text-base lg:text-lg py-3 px-6 bg-[#FDB813] hover:bg-[#e5a611] transition-colors duration-200"
              >
                Continue
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-neutral-50 px-8 lg:px-12 py-4 border-t border-neutral-200">
            <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-neutral-500 space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <span>Powered by Collective</span>
                <span className="hidden sm:block">•</span>
                <span>Secure Payment Processing</span>
              </div>
              <div className="flex items-center space-x-4">
                <button className="hover:text-neutral-700 transition-colors duration-200">Terms</button>
                <span>•</span>
                <button className="hover:text-neutral-700 transition-colors duration-200">Privacy</button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-neutral-200 p-6 lg:p-8">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-neutral-800 mb-2">What's Next?</h3>
              <p className="text-neutral-600 leading-relaxed">
                A confirmation email has been sent to your registered email address. 
                Keep your transaction ID safe for future reference.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default PaymentSuccessfulPage;