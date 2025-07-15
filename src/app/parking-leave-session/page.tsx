"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '../../components/ui/Button';
import Link from 'next/link';
import { CloseIcon, CarWithCityIllustration, GreenCheckSmallIcon, LargeSuccessTickIcon } from '@/components/ui/Icon';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import axios from 'axios';
import { BaseUrl } from '../../../config';
import { ChevronLeft, CreditCard, Smartphone, Clock, CheckCircle, AlertCircle, Info, Hash, Calendar, DollarSign } from 'lucide-react'; // Import Lucide icons

type LeaveSessionState = 'confirm' | 'loading' | 'success' | 'payment-processing' | 'pos-flow';
type PosFlowStep = 'pos-instructions' | 'pos-processing' | 'pos-success';

// Create a separate inner component to encapsulate client-side logic that uses useSearchParams
const LeaveSessionPageContent = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'Home' | 'Wallet' | 'History' | 'Payments'>('Home'); // This state doesn't seem to be used in the provided snippet
  const [pageState, setPageState] = useState<LeaveSessionState>('confirm');
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [transactionDetails, setTransactionDetails] = useState<any>(null);
  const [paymentResponse, setPaymentResponse] = useState<any>(null);
  const [paystackPopInstance, setPaystackPopInstance] = useState<any>(null);
  const [loading, setLoading] = useState(false); // Local loading state for payment

  // New states for enhanced POS flow
  const [posCurrentStep, setPosCurrentStep] = useState<PosFlowStep | null>(null);
  const [posTimer, setPosTimer] = useState(0);
  const [showReceiptInput, setShowReceiptInput] = useState(false);
  const [receiptNumber, setReceiptNumber] = useState('');
  const [isPosProcessing, setIsPosProcessing] = useState(false);

  const { endedSession, paymentResult, isLoading, error } = useAppSelector((state) => state.parking);
  const p = useAppSelector((state) => state.parking);
  console.log('Parking state:', p);
  const latestPaymentResult = endedSession?.paymentResult || paymentResult;
  console.log('i am the payment result', latestPaymentResult);

  // Effect for PaystackPop dynamic import
  useEffect(() => {
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
  }, []);

  // Effect for initial page state from search params
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

  // Effect for POS timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (posCurrentStep === 'pos-processing' && posTimer > 0) {
      interval = setInterval(() => {
        setPosTimer(prev => prev - 1);
      }, 1000);
    } else if (posCurrentStep === 'pos-processing' && posTimer === 0 && isPosProcessing) {
        // If timer runs out during processing, show receipt input
        setIsPosProcessing(false);
        setShowReceiptInput(true);
    }
    return () => clearInterval(interval);
  }, [posCurrentStep, posTimer, isPosProcessing]);


  const handlePayment = () => {
    if (!latestPaymentResult?.rawResponse?.data?.access_code) {
      setPaymentError('Payment information not available. Please try again.');
      return;
    }
    if (!paystackPopInstance) {
      setPaymentError('Payment system not ready. Please try again later.');
      return;
    }
    setLoading(true);
    setPageState('payment-processing');
    setPaymentError(null);
    paystackPopInstance.resumeTransaction(latestPaymentResult?.rawResponse?.data?.access_code , {
      onSuccess: (transaction: any) => {
        setTransactionDetails(transaction);
        handlePaymentSuccess(transaction);
        setLoading(false);
      },
      onCancel: () => {
        setPageState('confirm');
        setPaymentError('Payment was cancelled. You can try again when ready to exit.');
        setLoading(false);
      },
      onError: (error: any) => {
        setPageState('confirm');
        setPaymentError('Payment failed. Please try again or contact support.');
        setLoading(false);
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

  // --- NEW POS FUNCTIONS ---
  const handlePosPaymentInitiate = () => {
    setPageState('pos-flow');
    setPosCurrentStep('pos-instructions');
  };

  const handlePosInstructionsConfirmed = () => {
    setPosCurrentStep('pos-processing');
    setPosTimer(300); // 5 minutes for attendant interaction
    setIsPosProcessing(true); // Indicate that POS payment is being processed by attendant

    // Simulate attendant processing time
    setTimeout(() => {
      setIsPosProcessing(false); // Attendant finished processing
      setShowReceiptInput(true); // Prompt user for receipt number
    }, 3000); // Simulate 3 seconds for attendant to process
  };

  const handleReceiptSubmit = () => {
    if (receiptNumber.trim()) {
      setPosCurrentStep('pos-success');
      // Here you would typically send the receiptNumber to your backend for verification
      // For this example, we'll just transition to success
    } else {
      setPaymentError('Please enter a valid receipt number.');
    }
  };

  const handleBackToPaymentSelection = () => {
    setPosCurrentStep(null); // Clear POS flow state
    setPageState('confirm'); // Go back to main confirmation page
    setReceiptNumber(''); // Clear receipt number
    setShowReceiptInput(false); // Hide receipt input
    setIsPosProcessing(false); // Reset processing state
    setPosTimer(0); // Reset timer
    setPaymentError(null); // Clear any POS-related errors
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  // --- END NEW POS FUNCTIONS ---

const SessionDetailCard = () => {
  const sessionData = [
    { 
      label: "Plate Number", 
      value: endedSession?.displayPlateNumber || endedSession?.plateNumber || 'N/A',
      important: true,
      icon: Hash,
      color: "text-blue-600"
    },
    { 
      label: "Entry Time", 
      value: endedSession?.entryTime 
        ? new Date(endedSession.entryTime).toLocaleString(undefined, { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
          }) 
        : 'N/A',
      important: false,
      icon: Calendar,
      color: "text-purple-600"
    },
    { 
      label: "Duration", 
      value: endedSession?.durationInMinutes || endedSession?.duration 
        ? `${endedSession?.durationInMinutes || endedSession?.duration} minutes`
        : 'N/A',
      important: true,
      icon: Clock,
      color: "text-orange-600"
    },
    { 
      label: "Total Fee", 
      value: `₦${(endedSession?.calculatedFee || endedSession?.fee || 0).toLocaleString()}`,
      important: true,
      icon: DollarSign,
      color: "text-green-600"
    },
    { 
      label: "Payment Status", 
      value: pageState === 'success' || posCurrentStep === 'pos-success' ? 'Paid' : (endedSession?.status || 'Pending Payment'),
      important: false,
      icon: pageState === 'success' || posCurrentStep === 'pos-success' ? CheckCircle : Clock,
      color: pageState === 'success' || posCurrentStep === 'pos-success' ? "text-green-600" : "text-amber-600",
      isStatus: true
    },
    { 
      label: "Payment Method", 
      value: pageState === 'success' ? 'Card Payment' : (posCurrentStep === 'pos-success' ? 'POS Terminal' : 'Not Paid'),
      important: false,
      icon: CreditCard,
      color: "text-indigo-600"
    },
  ];

  const isPaid = pageState === 'success' || posCurrentStep === 'pos-success';

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-neutral-100 overflow-hidden mb-6 hover:shadow-xl transition-shadow duration-300">
      {/* Header with enhanced visual hierarchy */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-4 sm:px-6 py-4 border-b border-amber-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-bold text-neutral-800 flex items-center">
            <span 
              className="w-3 h-3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full mr-3 shadow-sm" 
              aria-hidden="true"
            ></span>
            Session Summary
          </h3>
          {isPaid && (
            <div className="flex items-center space-x-2 bg-green-100 px-3 py-1 rounded-full">
              <CheckCircle className="w-4 h-4 text-green-600" aria-hidden="true" />
              <span className="text-sm font-medium text-green-800">Completed</span>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced grid layout with better spacing */}
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {sessionData.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.label}
                className={`group relative p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-md ${
                  item.important 
                    ? 'border-amber-200 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 hover:border-amber-300' 
                    : 'border-neutral-200 bg-neutral-50 hover:border-neutral-300 hover:bg-neutral-100'
                }`}
                role="region"
                aria-labelledby={`label-${index}`}
              >
                {/* Icon and Label */}
                <div className="flex items-center space-x-2 mb-2">
                  <Icon 
                    className={`w-4 h-4 ${item.color} transition-transform duration-200 group-hover:scale-110`}
                    aria-hidden="true"
                  />
                  <div 
                    id={`label-${index}`}
                    className="text-sm font-medium text-neutral-600 uppercase tracking-wide"
                  >
                    {item.label}
                  </div>
                </div>

                {/* Value with enhanced typography */}
                <div className="flex items-center space-x-2">
                  <div 
                    className={`font-bold transition-colors duration-200 ${
                      item.important 
                        ? 'text-xl sm:text-2xl text-neutral-800' 
                        : 'text-base sm:text-lg text-neutral-700'
                    }`}
                    aria-live={item.isStatus ? "polite" : undefined}
                  >
                    {item.value}
                  </div>
                  {item.isStatus && isPaid && (
                    <CheckCircle 
                      className="w-5 h-5 text-green-600 ml-2" 
                      aria-label="Payment completed"
                    />
                  )}
                </div>

                {/* Visual emphasis for important items */}
                {item.important && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full shadow-sm"></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Summary footer for better context */}
        <div className="mt-6 p-4 bg-gradient-to-r from-neutral-50 to-neutral-100 rounded-xl border border-neutral-200">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                <Hash className="w-4 h-4 text-white" aria-hidden="true" />
              </div>
              <div>
                <div className="text-sm font-medium text-neutral-600">Session ID</div>
                <div className="text-lg font-bold text-neutral-800">
                  {endedSession?.displayPlateNumber || 'Unknown'}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-neutral-600">Status</div>
              <div className={`text-lg font-bold ${isPaid ? 'text-green-600' : 'text-amber-600'}`}>
                {isPaid ? 'Completed' : 'Pending'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
      <h2 className="text-4xl sm:text-5xl font-extrabold text-green-700 mb-4">EXIT GATE IS NOW OPEN</h2>
      <p className="text-2xl sm:text-3xl font-bold text-green-700 mb-6">You may now leave</p>
      <p className="text-lg sm:text-xl text-neutral-600 mb-2">Payment Successful!</p>
      <p className="text-neutral-500 mb-8 max-w-md mx-auto px-4 text-lg sm:text-xl">
        Thank you for using our service. Have a safe drive! 🎉
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
              <span className="text-green-600 font-semibold">Pending</span>
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
        <Button variant="tertiary" fullWidth onClick={() => router.push('/')} className="text-base py-3 text-neutral-600 hover:text-neutral-800">
          ← Back to Dashboard
        </Button>
      </div>
    </div>
  );

  // --- NEW POS COMPONENTS (adapted from EnhancedPosFlow) ---
  const PosInstructions = () => (
    <div className="max-w-2xl mx-auto px-4 text-center">
      <button 
        onClick={handleBackToPaymentSelection}
        className="flex items-center space-x-2 text-neutral-600 hover:text-neutral-800 mb-8"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Payment Options</span>
      </button>

      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 mb-8">
        <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Smartphone className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-neutral-800 mb-4">POS Payment Instructions</h2>
        <p className="text-neutral-600 mb-8">
          Please follow these steps to complete your POS payment with the attendant
        </p>
      </div>

      <div className="space-y-6 mb-8">
        {[
          {
            step: 1,
            title: "Locate the Parking Attendant",
            description: "Find the attendant at the exit gate or call them using the intercom",
            icon: "👨‍💼"
          },
          {
            step: 2,
            title: "Provide Your Details",
            description: `Show your plate number: ${endedSession?.displayPlateNumber || endedSession?.plateNumber || 'N/A'}`,
            icon: "🚗"
          },
          {
            step: 3,
            title: "Make Payment",
            description: `Pay ₦${(endedSession?.calculatedFee || endedSession?.fee || 0).toLocaleString()} using the POS terminal`,
            icon: "💳"
          },
          {
            step: 4,
            title: "Collect Receipt",
            description: "Get your payment receipt from the attendant",
            icon: "🧾"
          }
        ].map((item, index) => (
          <div key={index} className="flex items-start space-x-4 p-4 bg-white rounded-lg border border-neutral-200">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">{item.icon}</span>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-neutral-800 mb-1">
                Step {item.step}: {item.title}
              </h3>
              <p className="text-neutral-600 text-sm">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      <Button
        onClick={handlePosInstructionsConfirmed}
        fullWidth
        className="bg-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-purple-700 transition-colors shadow-lg"
      >
        I've Paid with POS
      </Button>
    </div>
  );

  const PosProcessingState = () => (
    <div className="max-w-2xl mx-auto px-4 text-center">
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 mb-8">
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <Smartphone className="w-10 h-10 text-white" />
          </div>
          {posTimer > 0 && isPosProcessing && ( // Only show timer during attendant processing
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full text-sm font-medium text-purple-600 border border-purple-200">
              {formatTime(posTimer)}
            </div>
          )}
        </div>
        <h2 className="text-2xl font-bold text-neutral-800 mb-4">
          {isPosProcessing ? 'Processing POS Payment' : 'Waiting for Receipt'}
        </h2>
        <p className="text-neutral-600 mb-8">
          {isPosProcessing 
            ? 'Please complete your payment with the attendant...' 
            : 'Enter your receipt number below to confirm payment'
          }
        </p>
      </div>

      {showReceiptInput && (
        <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
          <h3 className="font-semibold text-neutral-800 mb-4">Enter Receipt Number</h3>
          <div className="space-y-4">
            <input
              type="text"
              value={receiptNumber}
              onChange={(e) => setReceiptNumber(e.target.value)}
              placeholder="e.g., POS-123456"
              className="w-full p-3 border border-neutral-300 rounded-lg text-center font-mono text-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <Button
              onClick={handleReceiptSubmit}
              disabled={!receiptNumber.trim()}
              fullWidth
              className="bg-purple-600 text-white py-3 rounded-lg font-semibold disabled:bg-neutral-300 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors"
            >
              Confirm Payment
            </Button>
          </div>
        </div>
      )}

      {paymentError && ( // Display error message specific to POS flow
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 max-w-2xl mx-auto">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-1" />
            <p className="text-red-700 text-sm">{paymentError}</p>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-left">
            <h4 className="font-medium text-blue-900">Need Help?</h4>
            <p className="text-sm text-blue-700 mt-1">
              If you're having trouble with the POS payment, please contact the attendant or use the intercom for assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const PosSuccessState = () => (
    <div className="max-w-2xl mx-auto px-4 text-center">
      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 mb-8">
        <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-green-700 mb-4">POS Payment Successful!</h2>
        <p className="text-xl font-semibold text-green-600 mb-4">Exit Gate is Now Open</p>
        <p className="text-neutral-600 mb-8">
          Thank you for using our parking service. Have a safe drive! 🚗
        </p>
      </div>

      {receiptNumber && (
        <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-8">
          <h3 className="font-semibold text-neutral-800 mb-4">Receipt Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-600">Receipt Number:</span>
              <span className="font-mono text-neutral-800">{receiptNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Amount:</span>
              <span className="font-semibold text-neutral-800">₦{(endedSession?.calculatedFee || endedSession?.fee || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Payment Method:</span>
              <span className="text-neutral-800">POS Terminal</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Status:</span>
              <span className="text-green-600 font-semibold">Verified</span>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <Link href="/history/sessions" passHref>
          <Button
            variant="primary"
            fullWidth
            className="bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            📊 View Parking History
          </Button>
        </Link>
        <Button
          onClick={() => router.push('/')}
          variant="tertiary"
          fullWidth
          className="bg-neutral-100 text-neutral-700 py-3 rounded-xl font-semibold hover:bg-neutral-200 transition-colors"
        >
          ← Back to Dashboard
        </Button>
      </div>
    </div>
  );
  // --- END NEW POS COMPONENTS ---

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
         
          <div className="bg-gradient-to-br from-[#FDB813] to-orange-400 rounded-2xl p-6 md:p-8 text-white shadow-lg mt-8">
            <h3 className="text-xl sm:text-2xl font-bold mb-4">Ready to Exit?</h3>
            <p className="mb-6 opacity-90 text-sm sm:text-base">
              Click below to open the secure payment window.
            </p>
            <Button 
              onClick={handlePayment}
              variant="primary" 
              fullWidth 
              disabled={!latestPaymentResult?.gatewayReference || loading || pageState === 'pos-flow'}
              className="bg-white text-[#FDB813] hover:bg-neutral-50 text-base sm:text-lg py-3 sm:py-4 font-semibold shadow-md hover:shadow-lg transition-all"
            >
              {loading ? 'Processing Payment...' : (!latestPaymentResult?.gatewayReference ? 'Loading Payment...' : 'Proceed to Pay')}
            </Button>
            <Button
              onClick={handlePosPaymentInitiate} // Use the new POS initiate handler
              variant="secondary"
              fullWidth
              disabled={loading || pageState === 'pos-flow'} // Disable if online payment is loading or already in POS flow
              className="mt-4 text-base sm:text-lg py-3 sm:py-4 font-semibold shadow-md hover:shadow-lg transition-all !bg-blue-600 !text-white"
            >
              Pay with POS
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
    // Prioritize POS flow if active
    if (pageState === 'pos-flow' && posCurrentStep) {
      switch (posCurrentStep) {
        case 'pos-instructions': return <PosInstructions />;
        case 'pos-processing': return <PosProcessingState />;
        case 'pos-success': return <PosSuccessState />;
        default: return <PosInstructions />; // Fallback
      }
    }

    // Otherwise, render based on main pageState
    switch (pageState) {
      case 'confirm': return <ConfirmState />;
      case 'payment-processing': return <PaymentProcessingState />;
      case 'loading': return <LoadingState />;
      case 'success': return <SuccessState />;
      default: return <ConfirmState />;
    }
  };

  return (
    <>
      {pageState !== 'success' && posCurrentStep !== 'pos-success' && ( // Hide close button on final success screens
        <div className="flex justify-end mb-4 md:mb-6 -mt-2 md:-mt-4 -mr-2 md:-mr-4">
          <button onClick={() => router.push('/')} className="p-3 hover:bg-neutral-100 rounded-full transition-colors">
            <CloseIcon />
          </button>
        </div>
      )}
      {renderContent()}
    </>
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