"use client";
import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { topupWallet, fetchWalletBalance } from '@/store/slice/wallet';
import Button from '@/components/ui/Button';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const WalletTopupPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error, balance } = useAppSelector((state) => state.wallet);
  const [amount, setAmount] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [focusedInput, setFocusedInput] = useState(false);

  // Quick amount options
  const quickAmounts = [1000, 2000, 5000, 10000, 20000, 50000];

  useEffect(() => {
    dispatch(fetchWalletBalance());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return;
    
    setHasSubmitted(true);
    await dispatch(topupWallet(amount));
  };

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  const formatCurrency = (value: number | string) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(num);
  };

  const isValidAmount = amount && !isNaN(Number(amount)) && Number(amount) > 0;

  useEffect(() => {
    // Only redirect if we've submitted a request AND it was successful
    if (hasSubmitted && !error && !isLoading) {
      toast.success('Your wallet has been topped up successfully!');
      const timer = setTimeout(() => {
        window.location.href = '/wallet';
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [hasSubmitted, error, isLoading]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#FDB813] to-[#FFD700] rounded-full mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Top Up Wallet
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Add funds to your wallet securely
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Balance Section */}
          <div className="bg-gradient-to-r from-[#FDB813] to-[#FFD700] px-6 py-8 text-center">
            <p className="text-sm font-medium text-white/90 mb-2">Current Balance</p>
            <div className="text-3xl font-bold text-white">
              {balance !== null ? formatCurrency(balance) : (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                  <span className="ml-2 text-lg">Loading...</span>
                </div>
              )}
            </div>
          </div>

          {/* Form Section */}
          <div className="p-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Amount Input */}
              <div className="space-y-2">
                <label 
                  htmlFor="amount-input"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Amount to Add
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">₦</span>
                  </div>
                  <input
                    id="amount-input"
                    type="number"
                    min="1"
                    step="1"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    onFocus={() => setFocusedInput(true)}
                    onBlur={() => setFocusedInput(false)}
                    className={`w-full pl-8 pr-4 py-4 text-lg font-medium border-2 rounded-xl transition-all duration-200 
                      ${focusedInput 
                        ? 'border-[#FDB813] ring-4 ring-[#FDB813]/20 dark:ring-[#FDB813]/30' 
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                      }
                      bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                      placeholder-gray-400 dark:placeholder-gray-500
                      focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed`}
                    placeholder="0"
                    required
                    aria-describedby="amount-help"
                  />
                </div>
                <p id="amount-help" className="text-xs text-gray-500 dark:text-gray-400">
                  Enter the amount you want to add to your wallet
                </p>
              </div>

              {/* Quick Amount Buttons */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Quick Select
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {quickAmounts.map((quickAmount) => (
                    <button
                      key={quickAmount}
                      type="button"
                      onClick={() => handleQuickAmount(quickAmount)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 
                        ${amount === quickAmount.toString()
                          ? 'bg-[#FDB813] text-white shadow-md transform scale-105'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }
                        border border-gray-200 dark:border-gray-600 hover:border-[#FDB813] dark:hover:border-[#FDB813]
                        focus:outline-none focus:ring-2 focus:ring-[#FDB813] focus:ring-offset-2 dark:focus:ring-offset-gray-800`}
                      aria-label={`Quick select ${formatCurrency(quickAmount)}`}
                    >
                      {formatCurrency(quickAmount)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview Section */}
              {isValidAmount && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Amount to add:</span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(Number(amount))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">New balance:</span>
                    <span className="text-lg font-semibold text-[#FDB813]">
                      {balance !== null ? formatCurrency(Number(balance) + Number(amount)) : '---'}
                    </span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                variant="primary" 
                fullWidth 
                disabled={isLoading || !isValidAmount}
                className="relative overflow-hidden group"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add {isValidAmount ? formatCurrency(Number(amount)) : 'Funds'}
                  </div>
                )}
              </Button>
            </form>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4" role="alert">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-600 dark:text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-red-800 dark:text-red-300 font-medium">
                    {error}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Your transaction is secured with 256-bit SSL encryption
          </p>
        </div>
      </div>
    </div>
  );
};

export default WalletTopupPage;