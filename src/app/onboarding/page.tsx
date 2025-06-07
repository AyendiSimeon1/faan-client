// app/onboarding/page.tsx
"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Button from '@/components/ui/Button'; // Assuming path is correct
import PageIndicator from '@/components/ui/PageIndicator'; // Assuming path is correct
import SplashScreen from '@/components/onboarding/SplashScreen';

const onboardingSteps = [
  {
    type: 'splash',
    component: SplashScreen,
  },
  {
    imageSrc: "/onboarding-1.png", // MAKE SURE YOU HAVE THIS IMAGE
    alt: "Contactless parking",
    title: "Contactless parking",
    description: "Just scan, park, and pay without touching anything 🙌",
  },
  {
    imageSrc: "/onboarding-3.png", // MAKE SURE YOU HAVE THIS IMAGE
    alt: "Pay and exit easily",
    title: "Pay & Exit Easily",
    description: "Pay with your phone and drive out without queues 💳🚙",
  },
];

const NextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

const OnboardingPage: React.FC = () => {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);
  const [currentStep, setCurrentStep] = useState(0); // 0-indexed

  const handleSplashContinue = () => {
    setShowSplash(false);
    setCurrentStep(1);
  };

  const handleNextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSignIn = () => {
    router.push('/signin');
  };

  const handleGetStarted = () => {
    router.push('/signup');
  };

  const stepData = onboardingSteps[currentStep];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-12">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden">
        {/* Content Area */}
        {showSplash && stepData.type === 'splash' ? (
          <div className="flex flex-col items-center justify-center px-0 pt-0 pb-0 bg-transparent">
            <SplashScreen onContinue={handleSplashContinue} />
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center justify-center px-16 pt-16 pb-12 bg-gray-100">
              <div className="w-full max-w-lg h-80 relative mb-10">
                {stepData.imageSrc && stepData.alt && (
                  <Image
                    src={stepData.imageSrc}
                    alt={stepData.alt}
                    layout="fill"
                    objectFit="contain"
                    priority={currentStep === 1}
                  />
                )}
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4 text-center">
                {stepData.title}
              </h2>
              <p className="text-center text-gray-600 text-xl mb-12 leading-relaxed">
                {stepData.description ? stepData.description.split('<br />').map((line, index, arr) => (
                  <React.Fragment key={index}>
                    {line}
                    {index < arr.length - 1 && <br />}
                  </React.Fragment>
                )) : null}
              </p>
            </div>
            {/* Controls Area */}
            <div className="flex items-center justify-between px-16 py-10 bg-white">
              <PageIndicator count={onboardingSteps.length - 1} activeIndex={currentStep - 1} />
              {currentStep < onboardingSteps.length - 1 ? (
                <Button variant="icon" onClick={handleNextStep} aria-label="Next">
                  <NextIcon />
                </Button>
              ) : (
                <div className="flex space-x-6">
                  <Button variant="secondary" onClick={handleSignIn} className="py-4 px-10 text-lg">
                    Sign In
                  </Button>
                  <Button variant="primary" onClick={handleGetStarted} className="bg-black text-white hover:bg-neutral-800 py-4 px-10 text-lg">
                    Get Started
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <p className="mt-12 text-base text-gray-500">
        FAAN Parking Solutions © {new Date().getFullYear()}
      </p>
    </div>
  );
};

export default OnboardingPage;