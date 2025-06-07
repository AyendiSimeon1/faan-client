import React from 'react';

export const HamburgerMenuIcon = () => <svg className="w-6 h-6 text-[#2C2C2E]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>;
export const PlusIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;
export const MoreIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01" /></svg>;
export const GreenCheckCircleIcon = () => <svg className="w-5 h-5 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;
export const GreyCircleIcon = () => <svg className="w-5 h-5 text-neutral-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16z" clipRule="evenodd" /></svg>; // Simple circle
export const CloseIcon = () => <svg className="w-6 h-6 text-[#2C2C2E]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>;
export const GreenCheckSmallIcon = () => <svg className="w-4 h-4 text-green-500 inline-block ml-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>;
export const PlaceholderQRCode = () => (
  <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-20 sm:h-20 text-white">
    <path fill="currentColor" d="M0 0h30v30H0z M70 0h30v30H70z M0 70h30v30H0z M10 10h10v10H10z M80 10h10v10H80z M10 80h10v10H10z M40 0h10v10H40z M0 40h10v10H0z M40 40h30v30H40z M50 50h10v10H50z M90 40h10v10H90z M40 90h10v10H40z M70 70h30v10H70z M70 40h10v10H70z M35 35h10v10H35z M65 5h10v10H65z M5 65h10v10H5z M35 65h10v10H35z"/>
  </svg>
);
export const UserAvatar = ({ src, alt = "User Avatar", sizeClassName = "w-10 h-10" }: { src?: string; alt?: string; sizeClassName?: string }) => (
  <img
    src={src || `https://ui-avatars.com/api/?name=Joy&background=FDB813&color=2C2C2E&bold=true&size=128`}
    alt={alt}
    className={`${sizeClassName} rounded-full object-cover`}
  />
);
// Arrow right icon for QR card
export const ArrowRightIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>;




export const LargeSuccessTickIcon = () => (
  <div className="relative w-24 h-24 sm:w-32 sm:h-32">
    <div className="absolute inset-0 bg-green-100 rounded-full opacity-50"></div>
    <div className="absolute inset-2 sm:inset-3 bg-green-200 rounded-full opacity-70"></div>
    <div className="absolute inset-4 sm:inset-6 bg-green-500 rounded-full flex items-center justify-center">
      <svg className="w-12 h-12 sm:w-16 sm:h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
        <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
      </svg>
    </div>
  </div>
);

// Placeholder illustration for "Paid by Agent"
export const PaidByAgentIllustration = () => (
  <div className="w-full max-w-xs sm:max-w-sm mx-auto my-6 sm:my-8">
    <svg viewBox="0 0 200 150" className="w-full h-auto">
      {/* Globe */}
      <circle cx="100" cy="75" r="60" fill="#E0E0E0" />
      <path d="M100 15 A 60 60 0 0 1 100 135" stroke="#A0A0A0" strokeWidth="2" fill="none" />
      <path d="M40 75 A 60 60 0 0 1 160 75" stroke="#A0A0A0" strokeWidth="2" fill="none" />
      <path d="M60 35 Q 100 55 140 35" stroke="#A0A0A0" strokeWidth="2" fill="none" />
      <path d="M60 115 Q 100 95 140 115" stroke="#A0A0A0" strokeWidth="2" fill="none" />
      
      {/* Handshake */}
      <rect x="70" y="70" width="25" height="15" rx="3" fill="#FDB813" transform="rotate(-15 70 70)" />
      <rect x="105" y="65" width="25" height="15" rx="3" fill="#FDB813" transform="rotate(15 105 65)" />
      <circle cx="70" cy="70" r="5" fill="#2C2C2E" />
      <circle cx="130" cy="70" r="5" fill="#2C2C2E" />

      {/* Money symbols */}
      <text x="50" y="40" fontSize="15" fill="#FDB813" fontWeight="bold">$</text>
      <text x="140" y="45" fontSize="15" fill="#FDB813" fontWeight="bold">$</text>
      <text x="45" y="115" fontSize="15" fill="#FDB813" fontWeight="bold">$</text>
      <text x="145" y="110" fontSize="15" fill="#FDB813" fontWeight="bold">$</text>
    </svg>
  </div>
);

// Car Illustration (from previous response, slightly modified if needed)
export const CarWithCityIllustration = () => (
    <div className="w-full max-w-xs sm:max-w-sm mx-auto my-6 sm:my-8 relative">
      {/* City background */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-around items-end h-24 sm:h-32 opacity-30 -z-10">
        <div className="w-6 sm:w-8 h-full bg-neutral-300 rounded-t-md"></div>
        <div className="w-8 sm:w-10 h-5/6 bg-neutral-300 rounded-t-md"></div>
        <div className="w-6 sm:w-8 h-full bg-neutral-300 rounded-t-md"></div>
        <div className="w-10 sm:w-12 h-4/6 bg-neutral-300 rounded-t-md"></div>
        <div className="w-6 sm:w-8 h-full bg-neutral-300 rounded-t-md"></div>
      </div>
      {/* Car SVG (similar to previous example) */}
      <svg viewBox="0 0 200 100" className="w-full h-auto">
          <rect x="10" y="50" width="180" height="40" rx="10" fill="#FDB813"/>
          <rect x="30" y="30" width="140" height="30" rx="5" fill="#E0A00A"/>
          <circle cx="50" cy="90" r="10" fill="#4A4A4A"/>
          <circle cx="150" cy="90" r="10" fill="#4A4A4A"/>
          <rect x="40" y="35" width="40" height="20" fill="#AACCFF" opacity="0.7"/>
          <rect x="120" y="35" width="40" height="20" fill="#AACCFF" opacity="0.7"/>
          <circle cx="90" cy="40" r="10" fill="#6c5ce7" /> 
          <rect x="80" y="45" width="20" height="20" fill="#6c5ce7" />
      </svg>
    </div>
  );


export const SearchIcon = () => <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>;
export const DateFilterIcon = () => <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>;
export const ParkingLocationIcon = () => <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-green-600 bg-green-100">P</div>;
export const DownloadReceiptIcon = () => <svg className="w-5 h-5 text-neutral-500 hover:text-[#FDB813]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>;

export const FilterIcon = () => <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L16 11.414V17l-4 4v-9.586L3.293 6.707A1 1 0 013 6V4z"></path></svg>;
export const RefreshIcon = () => <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m-15.357-2a8.001 8.001 0 0015.357 2M15 15h-1.5M4.5 15H9"></path></svg>; // Simple refresh
export const AutoDebitIcon = () => <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m-15.357-2a8.001 8.001 0 0015.357 2M15 15h-1.5M4.5 15H9"></path></svg>;
export const TopUpIcon = () => <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5h-4v4h4v-4z"></path></svg>; // Or use WalletIcon from before
export const CardPaymentIcon = () => <svg className="w-6 h-6 text-neutral-600 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>;
export const WalletTopUpIcon = () => <svg className="w-6 h-6 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5h-4v4h4v-4z"></path></svg>; // Similar to TopUpIcon
export const LiveChatIcon = () => <svg className="w-5 h-5 text-[#FDB813]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>;
export const FaqIcon = () => <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.755 4 3.92C16 13.098 14.828 14 12.803 14c-1.13 0-1.906-.368-2.474-.933-.568-.565-.82-1.356-.82-2.167zm0 0H6.5a.5.5 0 000 1H8.228zm0 0V7.5A.5.5 0 018.728 7h.001M12 18h.01"></path></svg>;
export const PhoneIconSmall = () => <svg className="w-4 h-4 text-neutral-500" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path></svg>;
export const EmailIconSmall = () => <svg className="w-4 h-4 text-neutral-500" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>;
export const EditIcon = () => <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>;
export const ChevronRightSmallIcon = () => <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>;
export const LogoutIcon = () => <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>;
export const ParkingSpaceIcon = ({ status }: { status: 'successful' | 'failed' | 'pending' }) => {
    let color = 'text-blue-500 bg-blue-100';
    if (status === 'failed') color = 'text-red-500 bg-red-100';
    else if (status === 'pending') color = 'text-yellow-500 bg-yellow-100';
    return <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${color}`}>P</div>;
};

export const TransferActivityIcon = () => <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-purple-500 bg-purple-100">T</div>;
export const WalletAddActivityIcon = () => <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-green-500 bg-green-100">W+</div>;

export const CarIconSmall = () => <svg className="w-5 h-5 text-[#FDB813]" fill="currentColor" viewBox="0 0 20 20"><path d="M10 17a1 1 0 001-1V7a1 1 0 00-2 0v9a1 1 0 001 1zM8 10a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1zM4 8a2 2 0 012-2h8a2 2 0 012 2v5a1 1 0 01-1 1H5a1 1 0 01-1-1V8zm0 0V7a3 3 0 013-3h6a3 3 0 013 3v1m0 0V6.5A1.5 1.5 0 0013.5 5h-7A1.5 1.5 0 005 6.5V8m10 0h.5a.5.5 0 01.5.5v4a.5.5 0 01-.5.5H15V8zM5 8H4.5a.5.5 0 00-.5.5v4a.5.5 0 00.5.5H5V8z"></path></svg>; // Simple car
export const ClockIcon = () => <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
export const MoneyIcon = () => <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>;
export const MastercardIcon = () => <svg className="w-8 h-6" viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg"><path d="M35.002 1H2.998A2 2 0 001 3.004v17.992A2 2 0 002.998 23h32.004A2 2 0 0037 20.996V3.004A2 2 0 0035.002 1z" fill="#FFF"/><circle fill="#EB001B" cx="15" cy="12" r="7"/><circle fill="#F79E1B" cx="23" cy="12" r="7"/><path d="M22 12c0-2.4-1.2-4.5-3-5.7a7 7 0 00-4 11.4c1.8-1.2 3-3.3 3-5.7z" fill="#FF5F00"/></svg>;
export const VisaIcon = () => <svg className="w-8 h-6" viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg"><path d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" fill="#1A1F71"/><path d="M10.3 15.9c-.5-.2-1-.4-1.3-.6-.3-.2-.4-.4-.4-.7 0-.2.1-.4.4-.5.3-.1.8-.2 1.4-.2.7 0 1.2.1 1.6.2.4.2.7.5.8 1l2.3-.5c-.2-.7-.6-1.2-1.2-1.6-.6-.4-1.3-.6-2.2-.6-.7 0-1.4.1-1.9.4-.6.3-.9.7-1.1 1.1-.2.4-.3.9-.3 1.4 0 .6.1 1.1.4 1.5.3.4.8.7 1.4.9.4.2.9.3 1.3.4.4.1.6.3.6.6s-.1.4-.4.5c-.2.1-.7.2-1.3.2-.6 0-1.1-.1-1.5-.2-.4-.2-.7-.5-.8-.9l-2.3.5c.2.9.8 1.5 1.6 1.9.8.3 1.6.5 2.5.5.9 0 1.6-.1 2.2-.4.6-.3.9-.7 1.1-1.2.2-.5.3-1 .3-1.6.1-.6-.1-1.1-.4-1.5zM22.1 7.2h-2.6c-.4 0-.7.1-1 .2l-.2 2.6c.2-.1.4-.1.7-.1.3 0 .6.1.9.4s.4.6.5 1c.1.4.1.9.1 1.4v2.9h2.5V7.2h-.1zm6.8 3.9c0-2.1-1.1-3.4-2.9-3.4-.8 0-1.4.2-2 .7l.8 2c.3-.3.7-.5 1.1-.5.6 0 1 .3 1 .9s-.3.9-1 .9h-.5l-1.5 3.4h2.6l1.4-3.3h.1c.5 0 .8-.1.8-.6v-.3zM29.8 7.2L28.1 16h2.5l1.7-8.8h-2.5z" fill="#fff"/></svg>;
export const PaypalIcon = () => <svg className="w-8 h-6" viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg"><g fillRule="nonzero" fill="none"><path fill="#003087" d="M34.6 6.2c-.3-1-1.2-2.6-3.1-2.6H19c-.9 0-1.7.7-1.9 1.6l-3.1 12.5c-.2.7.3 1.3.9 1.3h5.1c.7 0 1.3-.5 1.4-1.2l.8-3.3c.2-.6.7-1 1.4-1h2.7c1.8 0 2.7-.9 3-2.5l.9-4.2c.1-.4.1-.8 0-1.1z"/><path fill="#009CDE" d="M35.3 5.1C34.9 3.8 33.8 2 31.5 2H17.1c-.9 0-1.7.7-1.9 1.6L12.2 16c-.2.7.3 1.3.9 1.3H18c.7 0 1.3-.5 1.4-1.2l.8-3.3c.2-.6.7-1 1.4-1h2.7c1.8 0 2.7-.9 3-2.5l.9-4.2c.1-.4.1-.8 0-1.1L35.3 5z"/><path fill="#002F86" d="M20.9 13.7L20.1 17c-.1.7.4 1.3 1.1 1.3h2.8c-.7 1.1-1.7 1.7-2.9 1.7H11.2c-.9 0-1.7-.7-1.9-1.6L6.2 5.9C6 5.2 6.5 4.6 7.2 4.6h5.1c.7 0 1.3.5 1.4 1.2l.8 3.3c.2.6.7 1 1.4 1h3.3c-.4.9-.9 1.7-1.5 2.3l-.8-2.3z"/></g></svg>;
export const WalletIconSolid = () => <svg className="w-8 h-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 1 1 0 000-2zM2 8a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" /></svg>;
export const RadioCheckedCircleIcon = () => <svg className="w-6 h-6 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;
export const RadioUncheckedCircleIcon = () => <svg className="w-6 h-6 text-neutral-300" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 10a3 3 0 116 0 3 3 0 01-6 0z" clipRule="evenodd" opacity="0.2" /><path fillRule="evenodd" d="M10 16a6 6 0 100-12 6 6 0 000 12zm0 2a8 8 0 100-16 8 8 0 000 16z" clipRule="evenodd" /></svg>;
export const DownloadIcon = () => <svg className="w-5 h-5 inline-block ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>;
export const PlusCircleIcon = () => <svg className="w-5 h-5 text-[#FDB813]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
export const CameraIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="7" width="18" height="13" rx="2" strokeWidth={2} />
    <circle cx="12" cy="13.5" r="3.5" strokeWidth={2} />
    <path d="M7 7V5a2 2 0 012-2h6a2 2 0 012 2v2" strokeWidth={2} />
  </svg>
);

export const UploadIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" strokeWidth={2} />
    <path d="M7 9l5-5 5 5" strokeWidth={2} />
    <path d="M12 4v12" strokeWidth={2} />
  </svg>
);