// components/SplashScreen.tsx (or wherever you have it)
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface SplashScreenProps {
  onContinue: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onContinue }) => {
  const [isVisible, setIsVisible] = useState(true);

  // Only handle fade for visual effect, not navigation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`
        fixed inset-0 z-50 flex flex-col items-center justify-center
        w-screen h-screen bg-[#FDB813] transition-opacity duration-500 ease-in-out
        overflow-hidden
        ${isVisible ? 'opacity-100' : 'opacity-95'}
      `}
      style={{ minHeight: '100vh', minWidth: '100vw' }}
    >
      <div className="flex flex-col items-center w-full h-full justify-center px-0 md:px-24 pt-0 pb-0">
        <div className="bg-white/10 rounded-3xl shadow-2xl flex flex-col items-center w-full max-w-3xl py-20 px-16">
          <h1 className="text-7xl font-extrabold text-white tracking-widest mb-10 mt-4 text-center drop-shadow-xl">
            FAAN
          </h1>
          <div className="w-full max-w-xl h-96 relative mb-10">
            <Image
              src="/images/splash-illustration.png"
              alt="Splash screen illustration"
              layout="fill"
              objectFit="contain"
              priority
            />
          </div>
          <p className="text-white text-2xl text-center font-semibold mt-2 mb-10 drop-shadow-xl">
            Welcome to FAAN Parking Solutions
          </p>
          <button
            onClick={onContinue}
            className="mt-4 px-16 py-5 bg-white text-[#FDB813] text-2xl font-bold rounded-xl shadow-lg hover:bg-neutral-50 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;