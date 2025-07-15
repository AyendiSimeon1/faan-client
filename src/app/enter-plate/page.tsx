"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import AppLayout from '@/components/layout/AppLayout';
import Button from '@/components/ui/Button';
import { endSession } from '@/store/slice/parking';
import { RootState } from '@/store/store';

const EnterPlatePage: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<any>();
  const [activeTab, setActiveTab] = useState<'Home' | 'Wallet' | 'History' | 'Payments'>('Home');
  const [secureId, setSecureId] = useState('');
  const [inputValues, setInputValues] = useState<string[]>(new Array(6).fill(''));
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const { isLoading, error } = useSelector((state: RootState) => state.parking);

  const secureIdLength = 6;

  // Update secureId when inputValues change
  useEffect(() => {
    setSecureId(inputValues.join(''));
  }, [inputValues]);

  const handleInputChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits
    
    const newValues = [...inputValues];
    newValues[index] = value;
    setInputValues(newValues);

    // Auto-focus next input
    if (value && index < secureIdLength - 1) {
      const nextInput = document.getElementById(`secure-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace' && !inputValues[index] && index > 0) {
      const prevInput = document.getElementById(`secure-input-${index - 1}`);
      prevInput?.focus();
    }
    
    // Handle paste
    if (e.key === 'Enter' && secureId.length === secureIdLength) {
      handleEndSession();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, secureIdLength);
    const newValues = new Array(secureIdLength).fill('');
    
    for (let i = 0; i < pastedText.length; i++) {
      newValues[i] = pastedText[i];
    }
    
    setInputValues(newValues);
    
    // Focus the next empty input or the last input
    const nextEmptyIndex = newValues.findIndex(val => !val);
    const targetIndex = nextEmptyIndex === -1 ? secureIdLength - 1 : nextEmptyIndex;
    setTimeout(() => {
      const targetInput = document.getElementById(`secure-input-${targetIndex}`);
      targetInput?.focus();
    }, 0);
  };

  const handleContinue = () => {
    if (secureId.length === secureIdLength) {
      console.log('Entered Secure ID:', secureId);
      alert(`Secure ID: ${secureId} - Continue (Simulated)`);
    } else {
      alert(`Please enter a complete ${secureIdLength}-character Secure ID.`);
    }
  };

  const handleEndSession = async () => {
    try {
      await dispatch(endSession(secureId)).unwrap();
      router.push('/parking-leave-session');
    } catch (err) {
      console.error('Failed to end session:', err);
    }
  };

  const clearInputs = () => {
    setInputValues(new Array(secureIdLength).fill(''));
    const firstInput = document.getElementById('secure-input-0');
    firstInput?.focus();
  };

  const isComplete = secureId.length === secureIdLength;
  const progressPercentage = (secureId.length / secureIdLength) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-[#FDB813] to-[#FFD700] rounded-full mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Enter Secure ID
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Enter your {secureIdLength}-digit parking session ID to end your session
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
          
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Progress
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {secureId.length}/{secureIdLength}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-[#FDB813] to-[#FFD700] h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Input Fields */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Secure ID
            </label>
            
            <div className="flex justify-center gap-2 sm:gap-3 mb-6">
              {inputValues.map((value, index) => (
                <input
                  key={index}
                  id={`secure-input-${index}`}
                  type="text"
                  value={value}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onFocus={() => setFocusedIndex(index)}
                  onBlur={() => setFocusedIndex(null)}
                  onPaste={handlePaste}
                  maxLength={1}
                  inputMode="numeric"
                  pattern="[0-9]"
                  className={`w-12 h-12 sm:w-14 sm:h-14 text-center text-lg sm:text-xl font-bold border-2 rounded-xl transition-all duration-200
                    ${focusedIndex === index
                      ? 'border-[#FDB813] ring-4 ring-[#FDB813]/20 dark:ring-[#FDB813]/30 bg-[#FDB813]/5 dark:bg-[#FDB813]/10'
                      : value
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    }
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                    focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed
                    placeholder-gray-400 dark:placeholder-gray-500`}
                  placeholder="0"
                  aria-label={`Secure ID digit ${index + 1}`}
                  disabled={isLoading}
                />
              ))}
            </div>

            {/* Helper Text */}
            <div className="text-center mb-6">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                {isComplete ? (
                  <span className="flex items-center justify-center text-green-600 dark:text-green-400">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Complete! Press Enter or click End Session
                  </span>
                ) : (
                  `Enter ${secureIdLength - secureId.length} more digit${secureId.length === secureIdLength - 1 ? '' : 's'}`
                )}
              </p>
              
              {secureId.length > 0 && (
                <button
                  onClick={clearInputs}
                  className="text-xs text-[#FDB813] hover:text-[#FFD700] font-medium transition-colors duration-200"
                  disabled={isLoading}
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4" role="alert">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-800 dark:text-red-300 font-medium">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              variant="primary"
              onClick={handleEndSession}
              fullWidth
              disabled={isLoading || !isComplete}
              className={`text-base py-4 font-semibold transition-all duration-200 
                ${isComplete 
                  ? 'bg-gradient-to-r from-[#FDB813] to-[#FFD700] hover:from-[#FFD700] hover:to-[#FDB813] transform hover:scale-[1.02] shadow-lg' 
                  : 'bg-gray-200 dark:bg-gray-700'
                }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Ending Session...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  End Session
                </div>
              )}
            </Button>

            {/* Secondary Action */}
            <button
              onClick={() => router.back()}
              disabled={isLoading}
              className="w-full py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium transition-colors duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Your session data is protected and encrypted
          </p>
        </div>
      </div>
    </div>
  );
};

export default EnterPlatePage;