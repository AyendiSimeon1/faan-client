"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '../../components/layout/AppLayout';
import Button from '../../components/ui/Button';
import { CloseIcon, PaidByAgentIllustration, GreenCheckSmallIcon } from '@/components/ui/Icon';

const SessionPaidByAgentPage: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'Home' | 'Wallet' | 'History' | 'Profile'>('Home');

  // Example session data
  const sessionDetails = {
    plateNumber: "ABJ246EL",
    entryTime: "12:05 PM",
    duration: "1h 42m",
    fee: "₦1,700",
    status: "Paid by Agent",
    paymentMethod: "POS",
  };

  const SessionDetailCard = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-8">
      <h3 className="text-xl font-semibold text-neutral-800 mb-6 flex items-center">
        <GreenCheckSmallIcon  />
        Payment Details
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { label: "Plate Number", value: sessionDetails.plateNumber, important: true },
          { label: "Entry Time", value: sessionDetails.entryTime },
          { label: "Session Duration", value: sessionDetails.duration, important: true },
          { label: "Total Fee", value: sessionDetails.fee, important: true },
          { 
            label: "Payment Status", 
            value: (
              <div className="flex items-center space-x-2">
                <GreenCheckSmallIcon />
                <span className="text-green-600 font-semibold">{sessionDetails.status}</span>
              </div>
            ),
            highlight: true
          },
          { label: "Payment Method", value: sessionDetails.paymentMethod },
        ].map(item => (
          <div key={item.label} className={`p-4 rounded-xl border transition-all duration-200 ${
            item.highlight 
              ? 'border-green-300 bg-gradient-to-br from-green-50 to-emerald-50' 
              : item.important 
                ? 'border-[#FDB813] bg-gradient-to-br from-amber-50 to-orange-50' 
                : 'border-neutral-200 bg-neutral-50'
          }`}>
            <div className="text-sm font-medium text-neutral-600 mb-1">{item.label}</div>
            <div className={`font-semibold ${item.important || item.highlight ? 'text-lg text-neutral-800' : 'text-neutral-700'}`}>
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const StatusBanner = () => (
    <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-white shadow-lg mb-8">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
          <GreenCheckSmallIcon  />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Payment Confirmed</h2>
          <p className="text-green-100">Session successfully paid by parking agent</p>
        </div>
      </div>
      <div className="bg-white bg-opacity-10 rounded-xl p-4 backdrop-blur-sm">
        <p className="text-white opacity-90">
          ✅ Your parking session has been processed and marked as paid by our on-site agent. 
          You may now exit the parking facility safely.
        </p>
      </div>
    </div>
  );

  return (
    <AppLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      containerClassName="py-8 max-w-4xl mx-auto"
    >
      {/* Custom Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-neutral-800">Session Completed</h1>
          <p className="text-xl text-neutral-600 mt-2">Payment processed by parking agent</p>
        </div>
        <button 
          onClick={() => router.push('/home')} 
          className="p-3 hover:bg-neutral-100 rounded-full transition-colors"
        >
          <CloseIcon />
        </button>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Left Column - Status & Illustration */}
        <div>
          <StatusBanner />
          
          {/* Illustration Section */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 text-center border border-blue-200">
            <div className="max-w-md mx-auto mb-6">
              <PaidByAgentIllustration  />
            </div>
            <h3 className="text-xl font-semibold text-neutral-800 mb-3">Agent-Assisted Payment</h3>
            <p className="text-neutral-600">
              Our parking agent has processed your payment on-site using a POS terminal. 
              No further action required from your end.
            </p>
          </div>
        </div>

        {/* Right Column - Session Details & Actions */}
        <div className="space-y-8">
          <SessionDetailCard />
          
          {/* Action Buttons */}
          <div className="space-y-4">
            <Button 
              variant="primary" 
              fullWidth 
              onClick={() => alert("Download Receipt Clicked!")} 
              className="text-lg py-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              📄 Download Receipt
            </Button>
            
            <Button 
              variant="tertiary" 
              fullWidth 
              onClick={() => router.push('/history')}
              className="text-lg py-4 border-2 hover:bg-neutral-50"
            >
              📊 View Parking History
            </Button>
            
            <Button 
              variant="tertiary" 
              fullWidth 
              onClick={() => router.push('/home')}
              className="text-base py-3 text-neutral-600 hover:text-neutral-800"
            >
              ← Back to Dashboard
            </Button>
          </div>

          {/* Additional Info Card */}
          <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
            <h4 className="font-semibold text-amber-800 mb-3 flex items-center">
              <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
              Important Notice
            </h4>
            <p className="text-sm text-amber-700">
              Please keep your receipt as proof of payment. If you have any questions about this transaction, 
              contact our support team with your session reference number.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Summary Card */}
      <div className="mt-12 bg-neutral-50 rounded-2xl p-8 border border-neutral-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-neutral-800 mb-2">Session Summary</h4>
            <p className="text-neutral-600">
              Vehicle {sessionDetails.plateNumber} • {sessionDetails.duration} • {sessionDetails.fee}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-green-600 font-semibold">Paid & Completed</span>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default SessionPaidByAgentPage;