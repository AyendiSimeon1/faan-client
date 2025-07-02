"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '../../components/layout/AppLayout';
import Button from '../../components/ui/Button';
import ScreenHeader from '../../components/ui/ScreenHeader';
import { MastercardIcon, VisaIcon, PaypalIcon, WalletIconSolid, RadioCheckedCircleIcon, RadioUncheckedCircleIcon, PlusCircleIcon } from '@/components/ui/Icon';

interface PaymentMethod {
  id: string;
  type: 'Master card' | 'Visa' | 'Paypal' | 'Wallet';
  details: string; // e.g., card number, balance
  icon: React.ReactNode;
}

const paymentMethods: PaymentMethod[] = [
  { id: 'mc1', type: 'Master card', details: '4679 6270 6312 8734', icon: <MastercardIcon /> },
  { id: 'visa1', type: 'Visa', details: '4679 6270 6312 8734', icon: <VisaIcon /> },
  { id: 'pp1', type: 'Paypal', details: 'joymiracle@paypal.com', icon: <PaypalIcon /> },
  { id: 'wallet1', type: 'Wallet', details: 'Balance: ₦10,000', icon: <WalletIconSolid /> },
];

const ChoosePaymentMethodPage: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'Home' | 'Wallet' | 'History' | 'Payments'>('Wallet');
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(paymentMethods[0].id);

  const handleProceed = () => {
    if (selectedMethodId) {
      console.log('Selected payment method ID:', selectedMethodId);
      router.push(`/payment/checkout?methodId=${selectedMethodId}`);
    }
  };

  const getMethodTypeColor = (type: string) => {
    switch (type) {
      case 'Master card':
        return 'from-red-500 to-orange-500';
      case 'Visa':
        return 'from-blue-600 to-blue-700';
      case 'Paypal':
        return 'from-blue-500 to-blue-600';
      case 'Wallet':
        return 'from-[#FDB813] to-[#e5a611]';
      default:
        return 'from-neutral-500 to-neutral-600';
    }
  };

  return (
    <AppLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      headerProps={{ 
        title: "Choose Payment Method", 
        onBack: () => router.back(), 
        showBackButton: false 
      }}
      containerClassName="flex items-start justify-center pt-8"
    >
      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Payment Methods */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-neutral-200 p-6 lg:p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-neutral-800">Select Payment Method</h2>
                <div className="flex items-center text-sm text-neutral-500">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>Secure & Encrypted</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethodId(method.id)}
                    className={`w-full flex items-center p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-md group
                      ${selectedMethodId === method.id 
                        ? 'border-[#FDB813] bg-gradient-to-r from-[#FDB813]/5 to-[#FDB813]/10 shadow-lg' 
                        : 'border-neutral-200 bg-white hover:border-neutral-300'}`}
                  >
                    <div className={`mr-6 flex-shrink-0 p-3 rounded-xl bg-gradient-to-br ${getMethodTypeColor(method.type)} shadow-sm`}>
                      <div className="text-white">
                        {method.icon}
                      </div>
                    </div>
                    <div className="flex-grow text-left">
                      <p className="text-lg font-semibold text-neutral-800 mb-1">{method.type}</p>
                      <p className="text-sm text-neutral-600 font-mono">{method.details}</p>
                      {method.type === 'Wallet' && (
                        <div className="mt-2 inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Available
                        </div>
                      )}
                    </div>
                    <div className="ml-6 flex-shrink-0">
                      <div className={`transition-all duration-200 ${selectedMethodId === method.id ? 'scale-110' : 'group-hover:scale-105'}`}>
                        {selectedMethodId === method.id ? (
                          <RadioCheckedCircleIcon  />
                        ) : (
                          <RadioUncheckedCircleIcon  />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Add New Payment Method */}
              <button 
                onClick={() => router.push('/payment/add-method')} 
                className="flex items-center justify-center w-full p-6 border-2 border-dashed border-neutral-300 rounded-xl text-[#FDB813] hover:text-[#e5a611] hover:border-[#FDB813] hover:bg-[#FDB813]/5 transition-all duration-200 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-[#FDB813]/10 rounded-full group-hover:bg-[#FDB813]/20 transition-colors duration-200">
                    <PlusCircleIcon />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-lg">Add New Payment Method</p>
                    <p className="text-sm text-neutral-600">Credit card, debit card, or digital wallet</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Right Column - Summary & Actions */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Selected Method Preview */}
              {selectedMethodId && (
                <div className="bg-white rounded-2xl shadow-lg border border-neutral-200 p-6">
                  <h3 className="text-lg font-bold text-neutral-800 mb-4">Selected Method</h3>
                  {(() => {
                    const selected = paymentMethods.find(m => m.id === selectedMethodId);
                    if (!selected) return null;
                    return (
                      <div className="flex items-center p-4 bg-gradient-to-r from-neutral-50 to-neutral-100 rounded-xl">
                        <div className={`mr-4 p-2 rounded-lg bg-gradient-to-br ${getMethodTypeColor(selected.type)}`}>
                          <div className="text-white text-sm">
                            {selected.icon}
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-neutral-800">{selected.type}</p>
                          <p className="text-xs text-neutral-600 font-mono">{selected.details}</p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Security Features */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-green-500 rounded-full mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-green-800">Secure Payment</h3>
                </div>
                <ul className="space-y-2 text-sm text-green-700">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    256-bit SSL encryption
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    PCI DSS compliant
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Fraud protection
                  </li>
                </ul>
              </div>

              {/* Action Button */}
              <div className="bg-white rounded-2xl shadow-lg border border-neutral-200 p-6">
                <Button 
                  variant="primary" 
                  onClick={handleProceed} 
                  disabled={!selectedMethodId}
                  className="w-full text-lg py-4 bg-[#FDB813] hover:bg-[#e5a611] disabled:opacity-50 disabled:cursor-not-allowed font-bold"
                >
                  Continue to Checkout
                </Button>
                
                <div className="mt-4 text-center">
                  <p className="text-xs text-neutral-500">
                    By proceeding, you agree to our{' '}
                    <button className="text-[#FDB813] hover:underline">Terms of Service</button>
                    {' '}and{' '}
                    <button className="text-[#FDB813] hover:underline">Privacy Policy</button>
                  </p>
                </div>
              </div>

              {/* Help Section */}
              <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-4">
                <div className="flex items-start">
                  <div className="p-2 bg-blue-100 rounded-full mr-3 flex-shrink-0">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-800 text-sm mb-1">Need Help?</h4>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      Contact our support team if you're having trouble with your payment method.
                    </p>
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

export default ChoosePaymentMethodPage;