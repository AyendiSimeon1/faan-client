"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AppLayout from '../../components/layout/AppLayout';
import Button from '../../components/ui/Button';
import ScreenHeader from '../../components/ui/ScreenHeader';
import { MastercardIcon, CarIconSmall, RadioCheckedCircleIcon } from '@/components/ui/Icon';

// Mock paymentMethods array (same as ChoosePaymentMethodPage for lookup)
const paymentMethodsList = [
  { id: 'mc1', type: 'Master card', details: '4679 6270 6312 8734', icon: <MastercardIcon /> },
  // ... other methods
];

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const methodId = searchParams.get('methodId');
  const [activeTab, setActiveTab] = useState<'Home' | 'Wallet' | 'History' | 'Profile'>('Wallet');
  
  const selectedMethod = paymentMethodsList.find(m => m.id === methodId) || paymentMethodsList[0]; // Fallback

  const orderDetails = {
    item: "Parking Space",
    date: "May 13, 2025",
    amount: "₦1,600", // This is the subtotal/total in this mockup
    rate: "₦200", // Example
  };

  const handlePay = () => {
    console.log('Paying with:', selectedMethod?.type, 'for amount:', orderDetails.amount);
    // Simulate payment processing
    router.push('/payment/success');
  };

  return (
    <AppLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      headerProps={{ 
        title: "Checkout", 
        onBack: () => router.back(), 
        showBackButton: true 
      }}
      containerClassName="flex items-start justify-center pt-8"
    >
      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Order Details & Payment Method */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-neutral-200 p-6 lg:p-8">
              <h2 className="text-xl font-bold text-neutral-800 mb-6">Order Summary</h2>
              <div className="flex items-start">
                <div className="bg-gradient-to-br from-neutral-100 to-neutral-200 p-4 rounded-xl mr-6 flex-shrink-0">
                  <CarIconSmall  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-neutral-800 mb-2">{orderDetails.item}</h3>
                  <div className="flex items-center text-neutral-600 mb-3">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a2 2 0 012 2v1l-3 9a2 2 0 01-2 2H8a2 2 0 01-2-2l-3-9V9a2 2 0 012-2h3z" />
                    </svg>
                    <span className="text-sm">{orderDetails.date}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-[#FDB813]">{orderDetails.amount}</span>
                    <span className="text-sm text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full">
                      Rate: {orderDetails.rate}/hour
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Card */}
            {selectedMethod && (
              <div className="bg-white rounded-2xl shadow-lg border border-neutral-200 p-6 lg:p-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-neutral-800">Payment Method</h2>
                  <button 
                    onClick={() => router.push('/payment/methods')}
                    className="text-[#FDB813] hover:text-[#e5a611] font-medium text-sm transition-colors duration-200"
                  >
                    Change
                  </button>
                </div>
                <div className="flex items-center p-4 bg-gradient-to-r from-neutral-50 to-neutral-100 rounded-xl border-2 border-[#FDB813]">
                  <div className="mr-4 flex-shrink-0">{selectedMethod.icon}</div>
                  <div className="flex-grow">
                    <p className="font-semibold text-neutral-800 mb-1">{selectedMethod.type}</p>
                    <p className="text-sm text-neutral-600 font-mono">{selectedMethod.details}</p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <RadioCheckedCircleIcon  />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Price Breakdown & Payment */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Price Breakdown Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-neutral-200 p-6 lg:p-8">
                <h2 className="text-xl font-bold text-neutral-800 mb-6">Price Breakdown</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-neutral-600">Hourly Rate</span>
                    <span className="font-semibold text-neutral-800">{orderDetails.rate}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-neutral-200">
                    <span className="text-neutral-600">Duration</span>
                    <span className="font-semibold text-neutral-800">8 hours</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-neutral-200">
                    <span className="text-neutral-600">Subtotal</span>
                    <span className="font-semibold text-neutral-800">{orderDetails.amount}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-neutral-200">
                    <span className="text-neutral-600">Tax & Fees</span>
                    <span className="font-semibold text-neutral-800">₦0</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t-2 border-neutral-200">
                    <span className="text-lg font-bold text-neutral-800">Total</span>
                    <span className="text-2xl font-bold text-[#FDB813]">{orderDetails.amount}</span>
                  </div>
                </div>
              </div>

              {/* Payment Action Card */}
              <div className="bg-gradient-to-br from-[#FDB813] to-[#e5a611] rounded-2xl shadow-lg p-6 lg:p-8 text-center">
                <div className="mb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">Secure Payment</h3>
                  <p className="text-white/90 text-sm">Your payment information is encrypted and secure</p>
                </div>
                
                <Button 
                  variant="primary" 
                  onClick={handlePay}
                  className="w-full bg-white text-[#FDB813] hover:bg-neutral-50 font-bold text-lg py-4 shadow-lg"
                >
                  Complete Payment
                </Button>
                
                <div className="flex items-center justify-center mt-4 text-white/80 text-xs">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>256-bit SSL encryption</span>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="bg-white rounded-xl border border-neutral-200 p-4">
                <div className="flex items-center justify-center space-x-4 text-xs text-neutral-500">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>Verified</span>
                  </div>
                  <div className="w-px h-4 bg-neutral-300"></div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Secure</span>
                  </div>
                  <div className="w-px h-4 bg-neutral-300"></div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Instant</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default CheckoutPage;