"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AppLayout from '../../components/layout/AppLayout';
import Button from '../../components/ui/Button';
import Link from 'next/link';
import { CloseIcon, CarWithCityIllustration, GreenCheckSmallIcon, LargeSuccessTickIcon } from '@/components/ui/Icon';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import PaystackPop from '@paystack/inline-js';
import axios from 'axios';
import { BaseUrl } from '../../../config';
import ReceiptGenerator from '../../components/ui/ReceiptGenerator';
type LeaveSessionState = 'confirm' | 'loading' | 'success' | 'payment-processing';

console.log('i am the base url ', BaseUrl);

const LeaveSessionPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'Home' | 'Wallet' | 'History' | 'Profile'>('Home');
  const [pageState, setPageState] = useState<LeaveSessionState>('confirm');
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [transactionDetails, setTransactionDetails] = useState<any>(null);
  const [paymentResponse, setPaymentResponse] = useState<any>(null);

  const { endedSession, paymentResult, isLoading, error } = useAppSelector((state) => state.parking);
  // const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL; // Make sure this is set in your env
  console.log('i am the payment response guy', paymentResponse); 
  // console.log('cench', paymentResponse.data.gatewayResponse.amount);
  console.log('i am the ended session', endedSession);
  console.log('i am the payment result', paymentResult);

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

  const handlePayment = () => {
    if (!paymentResult?.rawResponse?.data?.access_code 
) {
      alert('Payment information not available. Please try again.');
      return;
    }

    setPageState('payment-processing');
    setPaymentError(null);

    const popup = new PaystackPop();
    
    popup.resumeTransaction(paymentResult?.rawResponse?.data?.access_code , {
      onSuccess: (transaction) => {
        console.log('Payment successful:', transaction);
        setTransactionDetails(transaction);
        handlePaymentSuccess(transaction);
      },
      onCancel: () => {
        console.log('Payment cancelled by user');
        setPageState('confirm');
        setPaymentError('Payment was cancelled. You can try again when ready to exit.');
      },
      onError: (error) => {
        console.error('Payment error:', error);
        setPageState('confirm');
        setPaymentError('Payment failed. Please try again or contact support.');
      }
    });
  };

  const handlePaymentSuccess = async (transaction: any) => {
    try {
      setPageState('loading');
      
      // Verify transaction with your backend
      const authToken = localStorage.getItem('accessToken');
      const verificationResponse = await axios.put(
  `${BaseUrl}/payments/verify/${transaction.reference}`,
  {}, // Empty body (or your actual request body if needed)
  {
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  }
);

      if (verificationResponse) {
        // Payment verified successfully
        console.log('Payment verified:', verificationResponse.data);
        setPaymentResponse(verificationResponse.data);
        // Update any necessary state or dispatch actions
        // You might want to update the parking session status
        
        setTimeout(() => {
          setPageState('success');
        }, 2000);
        
      } else {
        console.log('i am the error', error);
        // throw new Error('Payment verification failed');
      }
    } catch (error) {
      console.log('Payment verification failed:', error);
      setPageState('confirm');
      setPaymentError('Payment completed but verification failed. Please contact support with your transaction reference.');
    }
  };

  const SessionDetailCard = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-8 mb-8">
      <h3 className="text-xl font-semibold text-neutral-800 mb-6 flex items-center">
        <span className="w-2 h-2 bg-[#FDB813] rounded-full mr-3"></span>
        Session Summary
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { label: "Plate Number", value: endedSession?.displayPlateNumber || endedSession?.plateNumber, important: true },
          { label: "Entry Time", value: endedSession?.entryTime, important: false },
          { label: "Duration", value: endedSession?.durationInMinutes || endedSession?.duration, important: true },
          { label: "Total Fee", value: endedSession?.calculatedFee || endedSession?.fee, important: true },
          { 
            label: "Payment Status", 
            value: (
              <div className="flex items-center space-x-2">
                <span>{endedSession?.status || 'Pending Payment'}</span>
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
            <div className={`font-semibold ${item.important ? 'text-lg text-neutral-800' : 'text-neutral-700'}`}>
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const PaymentProcessingState = () => (
    <div className="text-center py-12">
      <div className="relative mb-8">
        <div className="w-24 h-24 mx-auto border-4 border-[#FDB813] border-t-orange-400 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">💳</span>
          </div>
        </div>
      </div>
      <h3 className="text-2xl font-semibold text-neutral-800 mb-3">Processing Payment</h3>
      <p className="text-neutral-600 mb-8 max-w-md mx-auto">
        Please complete your payment in the popup window...
      </p>
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
        Payment successful! Preparing your exit confirmation and opening the gate...
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
      <p className="text-neutral-500 mb-8 max-w-lg mx-auto">
        You may now exit the parking lot. Thank you for choosing our parking service. Have a safe drive! 🎉
      </p>

      {/* Transaction Details */}
      {transactionDetails && (
        <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-8 max-w-md mx-auto">
          <h4 className="font-semibold text-neutral-800 mb-4">Transaction Details</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-600">Reference:</span>
              <span className="font-mono text-neutral-800">{transactionDetails.reference}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Amount:</span>
              <span className="font-semibold text-neutral-800">₦{(paymentResponse.data.gatewayResponse.amount / 100).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Status:</span>
              <span className="text-green-600 font-semibold">Successful</span>
            </div>
          </div>
        </div>
      )}

      {/* Success Actions */}
      <div className="max-w-md mx-auto space-y-4">
         {/* <ReceiptGenerator
          receiptData={receiptData}
          onDownload={() => {
            console.log('Receipt downloaded successfully!');
            // Optional: Track analytics or show success message
          }}
          className="w-full text-lg py-4 shadow-lg hover:shadow-xl transition-all duration-200 bg-[#FDB813] hover:bg-[#e6a711] text-white"
        /> */}
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

      {/* Error Message */}
      {paymentError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8 max-w-2xl mx-auto">
          <div className="flex items-center">
            <span className="text-red-600 mr-2">⚠️</span>
            <p className="text-red-700">{paymentError}</p>
          </div>
        </div>
      )}

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
              Make sure you're near your vehicle before confirming exit. The gate will open for 5 minutes after payment.
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
              Click below when you're ready to leave. A secure payment window will open to process your payment.
            </p>
            
            <Button 
              onClick={handlePayment}
              variant="primary" 
              fullWidth 
              disabled={!paymentResult?.gatewayReference || isLoading}
              className="bg-white text-[#FDB813] hover:bg-neutral-50 text-lg py-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {!paymentResult?.gatewayReference ? 'Loading Payment...' : 'Make Payment'}
            </Button>
            
            <p className="text-sm mt-4 opacity-75 text-center">
              Gate will open automatically after payment confirmation
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
      case 'payment-processing':
        return <PaymentProcessingState />;
      case 'loading':
        return <LoadingState />;
      case 'success':
        return <SuccessState />;
      default:
        return <ConfirmState />;
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