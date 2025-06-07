"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

import Image from 'next/image';
import Button from '@/components/ui/Button';
import PageIndicator from '@/components/ui/PageIndicator';

const OnboardingScreenTwo: React.FC = () => {
  const router = useRouter();

  const handleSignIn = () => {
    router.push('/sign-in'); // Assuming a sign-in page
  };

  const handleGetStarted = () => {
    router.push('/sign-up'); // Assuming a sign-up page
  };

  // Placeholder for status bar icons (same as OnboardingScreenOne)
  const StatusBar = () => (
    <div className="px-6 pt-3 flex justify-between items-center text-sm text-neutral-700">
      <div>9:41</div>
      <div className="flex space-x-1">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V9a2 2 0 00-2-2h-2a2 2 0 00-2 2v10" /></svg>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.111 16.059A7.5 7.5 0 0112 15c2.095 0 3.999.858 5.389 2.247M12 15V9m0 0a2.503 2.503 0 00-2.5-2.5h-1a2.5 2.5 0 000 5h1A2.5 2.5 0 0012 9z" /></svg>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V9a2 2 0 00-2-2h-2a2 2 0 00-2 2v10" /></svg>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-md mx-auto shadow-lg">
      <StatusBar />
      <div className="flex-grow flex flex-col items-center justify-center px-6 pt-8 pb-4 bg-[#F7F7F7] rounded-b-[40px]">
        <div className="w-full max-w-xs h-64 md:h-72 relative mb-8">
            {/* Illustration: Pay & Exit Easily scene */}
            {/* Replace with your actual Image component or SVG */}
           <Image 
             src="/images/onboarding-illustration-2.png" // MAKE SURE YOU HAVE THIS IMAGE OR REPLACE
             alt="Pay and exit easily"
             layout="fill"
             objectFit="contain"
           />
        </div>
        <h2 className="text-2xl font-bold text-[#2C2C2E] mb-2 text-center">
          Pay & Exit Easily
        </h2>
        <p className="text-center text-[#8A8A8E] text-base mb-10 leading-relaxed">
          Pay with your phone and drive out without <br /> queues 💳🚙
        </p>
      </div>

      <div className="flex items-center justify-between px-6 py-8">
        <PageIndicator count={2} activeIndex={1} />
        <div className="flex space-x-3">
          <Button variant="secondary" onClick={handleSignIn} className="py-3 px-8 text-sm">
            Sign In
          </Button>
          <Button variant="primary" onClick={handleGetStarted} className="bg-black text-white hover:bg-neutral-800 py-3 px-8 text-sm">
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingScreenTwo;