import React from 'react';
import ScreenHeader from '../ui/ScreenHeader'; // Assuming ScreenHeader is in ui

interface AuthPageLayoutProps {
  children: React.ReactNode;
  headerProps?: any;
  cardClassName?: string;
  showLogo?: boolean; // For FAAN logo
}

const AuthPageLayout: React.FC<AuthPageLayoutProps> = ({ children, headerProps, cardClassName = '', showLogo = false }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 p-4 selection:bg-[#FDB813] selection:text-black">
      {showLogo && (
         <div className="mb-2 text-4xl font-bold text-[#FDB813]">
            FAAN
          </div>
      )}
      {/* This card will be centered by the parent div's flex properties */}
      <div className={`bg-white rounded-xl shadow-2xl w-full max-w-md ${cardClassName}`}>
        {/* {headerProps && <ScreenHeader {...headerProps} className="rounded-t-xl" />} */}
        <div className="p-2 sm:p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthPageLayout;