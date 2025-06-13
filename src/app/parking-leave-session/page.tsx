"use client";
import React, { useState, useEffect, Suspense } from 'react'; // Import Suspense
import { useRouter, useSearchParams } from 'next/navigation';
import AppLayout from '../../components/layout/AppLayout';
import Button from '../../components/ui/Button';
import Link from 'next/link';
import { CloseIcon, CarWithCityIllustration, GreenCheckSmallIcon, LargeSuccessTickIcon } from '@/components/ui/Icon';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import axios from 'axios';
import { BaseUrl } from '../../../config';

// Do NOT import PaystackPop directly here. It will be imported dynamically/conditionally below.

type LeaveSessionState = 'confirm' | 'loading' | 'success' | 'payment-processing';

// Create a separate inner component to encapsulate client-side logic that uses useSearchParams
const LeaveSessionPageContent = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams(); // This hook is now inside a client-only component rendered within Suspense
  const [activeTab, setActiveTab] = useState<'Home' | 'Wallet' | 'History' | 'Profile'>('Home');
  const [pageState, setPageState] = useState<LeaveSessionState>('confirm');
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [transactionDetails, setTransactionDetails] = useState<any>(null);
  const [paymentResponse, setPaymentResponse] = useState<any>(null);
  // State to hold the PaystackPop instance
  const [paystackPopInstance, setPaystackPopInstance] = useState<any>(null);

  const { endedSession, paymentResult, isLoading, error } = useAppSelector((state) => state.parking);

  useEffect(() => {
    // Conditionally import and instantiate PaystackPop only in the browser environment
    if (typeof window !== 'undefined') {
      import('@paystack/inline-js')
        .then((mod) => {
          setPaystackPopInstance(new mod.default());
        })
        .catch((err) => {
          console.error('Failed to load PaystackPop:', err);
          setPaymentError('Failed to load payment system. Please refresh.');
        });
    }
  }, []); // Empty dependency array means this runs once on mount (client-side only)

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
  }, [searchParams]); // Depend on searchParams

  const handlePayment = () => {
    if (!paymentResult?.rawResponse?.data?.access_code) {
      console.error('Payment information not available. Please try again.');
      setPaymentError('Payment information not available. Please try again.');
      return;
    }

    if (!paystackPopInstance) {
      console.error('PaystackPop is not initialized.');
      setPaymentError('Payment system not ready. Please try again later.');
      return;
    }

    setPageState('payment-processing');
    setPaymentError(null);

    paystackPopInstance.resumeTransaction(paymentResult?.rawResponse?.data?.access_code , {
      onSuccess: (transaction: any) => {
        setTransactionDetails(transaction);
        handlePaymentSuccess(transaction);
      },
      onCancel: () => {
        setPageState('confirm');
        setPaymentError('Payment was cancelled. You can try again when ready to exit.');
      },
      onError: (error: any) => {
        setPageState('confirm');
        setPaymentError('Payment failed. Please try again or contact support.');
      }
    });
  };

  const handlePaymentSuccess = async (transaction: any) => {
    try {
      setPageState('loading');
      
      const authToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      
      if (!authToken) {
        throw new Error('Authentication token not found');
      }

      const verificationResponse = await axios.put(
        `${BaseUrl}/payments/verify/${transaction.reference}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        }
      );

      if (verificationResponse) {
        setPaymentResponse(verificationResponse.data);
        setTimeout(() => {
          setPageState('success');
        }, 2000);
      } else {
        throw new Error('Payment verification failed');
      }
    } catch (error) {
      setPageState('confirm');
      setPaymentError('Payment completed but verification failed. Please contact support with your transaction reference.');
    }
  };

  const SessionDetailCard = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-4 sm:p-6 mb-6">
      <h3 className="text-lg sm:text-xl font-semibold text-neutral-800 mb-4 flex items-center">
        <span className="w-2 h-2 bg-[#FDB813] rounded-full mr-3"></span>
        Session Summary
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: "Plate Number", value: endedSession?.displayPlateNumber || endedSession?.plateNumber, important: true },
          { label: "Entry Time", value: endedSession?.entryTime, important: false },
          { label: "Duration", value: endedSession?.durationInMinutes || endedSession?.duration, important: true },
          { label: "Total Fee", value: endedSession?.calculatedFee || endedSession?.fee, important: true },
          { 
            label: "Payment Status", 
            value: (
              <div className="flex items-center space-x-2">
                <span>{pageState === 'success' ? 'Paid' : (endedSession?.status || 'Pending Payment')}</span>
                {pageState === 'success' && <GreenCheckSmallIcon />}
              </div>
            )
          },
          { label: "Payment Method", value: endedSession?.paymentMethod || 'Card Payment' },
        ].map(item => (
          <div key={item.label} className={`p-4 rounded-xl border transition-all duration-200 ${
            item.important 
              ? 'border-[#FDB813] bg-gradient-to-br from-amber-50 to-orange-50' 
              : 'border-neutral-200 bg-neutral-50'
          }`}>
            <div className="text-sm font-medium text-neutral-600 mb-1">{item.label}</div>
            <div className={`font-semibold ${item.important ? 'text-base sm:text-lg text-neutral-800' : 'text-neutral-700'}`}>
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const PaymentProcessingState = () => (
    <div className="text-center py-8 sm:py-12 flex flex-col items-center justify-center h-full">
      <div className="relative mb-6 sm:mb-8">
        <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto border-4 border-[#FDB813] border-t-orange-400 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">💳</span>
          </div>
        </div>
      </div>
      <h3 className="text-xl sm:text-2xl font-semibold text-neutral-800 mb-3">Processing Payment</h3>
      <p className="text-neutral-600 max-w-sm mx-auto">
        Please complete your payment in the popup window...
      </p>
    </div>
  );

  const LoadingState = () => (
    <div className="text-center py-8 sm:py-12 flex flex-col items-center justify-center h-full">
      <div className="relative mb-6 sm:mb-8">
        <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto border-4 border-green-200 border-t-green-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <CarWithCityIllustration  />
        </div>
      </div>
      <h3 className="text-xl sm:text-2xl font-semibold text-neutral-800 mb-3">Processing Your Exit</h3>
      <p className="text-neutral-600 mb-8 max-w-sm mx-auto">
        Payment successful! Preparing your exit confirmation.
      </p>
    </div>
  );

  const SuccessState = () => (
    <div className="text-center py-8 sm:py-12 md:py-16">
      <div className="mb-6 sm:mb-8 relative">
        <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto bg-gradient-to-br from-green-50 to-emerald-50 rounded-full flex items-center justify-center border-4 border-green-200">
          <LargeSuccessTickIcon  />
        </div>
      </div>
      
      <h2 className="text-3xl sm:text-4xl font-bold text-neutral-800 mb-3">Payment Successful!</h2>
      <p className="text-lg sm:text-xl text-neutral-600 mb-2">Exit gate is now open</p>
      <p className="text-neutral-500 mb-8 max-w-md mx-auto px-4">
        You may now exit. Thank you for using our service. Have a safe drive! 🎉
      </p>

      {transactionDetails && (
        <div className="bg-white rounded-xl border border-neutral-200 p-4 sm:p-6 mb-8 max-w-md mx-auto">
          <h4 className="font-semibold text-neutral-800 mb-4">Transaction Details</h4>
          <div className="space-y-2 text-sm text-left">
            <div className="flex justify-between">
              <span className="text-neutral-600">Reference:</span>
              <span className="font-mono text-neutral-800 break-all">{transactionDetails.reference}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Amount:</span>
              <span className="font-semibold text-neutral-800">₦{(paymentResponse?.data?.gatewayResponse?.amount / 100).toLocaleString() || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Status:</span>
              <span className="text-green-600 font-semibold">Successful</span>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-md mx-auto space-y-3 px-4">
        <Link href="/history/sessions" passHref>
          <Button variant="tertiary" fullWidth className="text-base sm:text-lg py-3 border-2 hover:bg-neutral-50">
            📊 View Parking History
          </Button>
        </Link>
        <Button variant="tertiary" fullWidth onClick={() => router.push('/home')} className="text-base py-3 text-neutral-600 hover:text-neutral-800">
          ← Back to Dashboard
        </Button>
      </div>
    </div>
  );

  const ConfirmState = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-800 mb-3">Ready to Leave?</h1>
        <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto">
          Review your session and confirm to proceed with payment.
        </p>
      </div>

      {paymentError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 max-w-2xl mx-auto">
          <div className="flex items-start">
            <span className="text-red-600 mr-2 mt-1">⚠️</span>
            <p className="text-red-700 text-sm">{paymentError}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        <div className="flex flex-col items-center order-2 lg:order-1">
          <SessionDetailCard />
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 sm:p-6 border border-blue-200 w-full">
            <h4 className="font-semibold text-neutral-800 mb-2">💡 Quick Tip</h4>
            <p className="text-sm text-neutral-600">
              The gate opens for 5 minutes after payment. Please be near your vehicle before you pay.
            </p>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="w-full max-w-md mx-auto mb-8 lg:mb-0">
            <CarWithCityIllustration />
          </div>
          <div className="bg-gradient-to-br from-[#FDB813] to-orange-400 rounded-2xl p-6 md:p-8 text-white shadow-lg mt-8">
            <h3 className="text-xl sm:text-2xl font-bold mb-4">Ready to Exit?</h3>
            <p className="mb-6 opacity-90 text-sm sm:text-base">
              Click below to open the secure payment window.
            </p>
            <Button 
              onClick={handlePayment}
              variant="primary" 
              fullWidth 
              disabled={!paymentResult?.gatewayReference || isLoading}
              className="bg-white text-[#FDB813] hover:bg-neutral-50 text-base sm:text-lg py-3 sm:py-4 font-semibold shadow-md hover:shadow-lg transition-all"
            >
              {!paymentResult?.gatewayReference ? 'Loading Payment...' : 'Proceed to Pay'}
            </Button>
            <p className="text-xs sm:text-sm mt-4 opacity-80 text-center">
              Gate opens automatically after payment
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (pageState) {
      case 'confirm': return <ConfirmState />;
      case 'payment-processing': return <PaymentProcessingState />;
      case 'loading': return <LoadingState />;
      case 'success': return <SuccessState />;
      default: return <ConfirmState />;
    }
  };

  return (
    <AppLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      hideHeader={pageState === 'success'}
      containerClassName="p-4 md:py-8"
    >
      {pageState !== 'success' && (
        <div className="flex justify-end mb-4 md:mb-6 -mt-2 md:-mt-4 -mr-2 md:-mr-4">
          <button onClick={() => router.push('/home')} className="p-3 hover:bg-neutral-100 rounded-full transition-colors">
            <CloseIcon />
          </button>
        </div>
      )}
      {renderContent()}
    </AppLayout>
  );
};

// Main page component wrapped with Suspense
const LeaveSessionPage = () => {
  return (
    <Suspense fallback={<div>Loading parking session details...</div>}>
      <LeaveSessionPageContent />
    </Suspense>
  );
};

export default LeaveSessionPage;
