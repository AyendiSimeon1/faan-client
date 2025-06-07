"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // Import Next.js Image component

const SplashScreen: React.FC = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Navigate to the next screen after animation or delay
      // For demo, let's assume it navigates after 3 seconds total (including fade-out)
      setTimeout(() => {
        router.push('/onboarding-one'); // Or your desired next route
      }, 500); // Corresponds to fade-out duration
    }, 2500); // Display splash for 2.5 seconds

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div
      className={`
        fixed inset-0 flex flex-col items-center justify-between 
        bg-[#FDB813] transition-opacity duration-500 ease-in-out
        ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
    >
      {/* Spacer for top area or status bar if any */}
      <div className="h-16"></div>

      <div className="flex flex-col items-center">
        <h1 className="text-7xl font-bold text-white tracking-wider">
          FAAN
        </h1>
      </div>

      <div className="w-full">
        {/* Placeholder for Splash Illustration */}
        {/* Replace with your actual Image component or SVG */}
        <div className="relative w-full h-[350px] md:h-[400px]">
          {/* 
            Example using Next/Image (ensure image is in /public folder):
            <Image 
              src="/images/splash-illustration.svg" // Replace with your image path
              alt="Splash screen illustration" 
              layout="fill"
              objectFit="contain" // or "cover" depending on your image
              priority 
            /> 
          */}
          <div className="w-full h-full bg-yellow-400 flex items-center justify-center text-white text-sm">
            {/* Illustration: Car at a parking meter - you would place your actual SVG/image here */}
            <Image 
              src="/images/splash-illustration.png" // MAKE SURE YOU HAVE THIS IMAGE OR REPLACE
              alt="Splash screen illustration"
              width={400} // Adjust as needed
              height={350} // Adjust as needed
              objectFit="contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;