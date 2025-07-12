"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '../components/layout/AppLayout';
import Button from '../components/ui/Button';
// import { UserAvatar, HamburgerMenuIcon, PlusIcon, MoreIcon, PlaceholderQRCode, ArrowRightIcon } from '../components/ui/Icons';
import Link from 'next/link';
import { ArrowRightIcon, HamburgerMenuIcon, MoreIcon, PlaceholderQRCode, PlusIcon, UserAvatar } from '@/components/ui/Icon';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
// import { fetchActiveSession } from '@/store/slice/parking';
import { setActiveBottomTab } from '@/store/slice/ui';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchWalletBalance } from '@/store/slice/wallet';



const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const fullState = useAppSelector((state) => state);
  console.log('Full state:', fullState); // Log the entire state for debugging
  const [activeTab, setActiveTab] = useState<'Home' | 'Wallet' | 'History' | 'Payments'>('Home');
  const [sessionStatus, setSessionStatus] = useState<'inactive' | 'active' | 'pending'>('inactive'); // Example state
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const { isLoading, error, balance } = useAppSelector((state) => state.wallet);


  const { activeSession, isLoading: parkingLoading } = useAppSelector(state => state.parking);
  const { user } = useAppSelector(state => state.auth);
  console.log('yes i am the real users', user);

  console.log('i am the user', user);
  useEffect(() => {
      dispatch(fetchWalletBalance());
    }, [dispatch]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Simple authentication check: only check for token in localStorage
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.replace('/signin');
      return;
    }
    setIsCheckingAuth(false);
    dispatch(setActiveBottomTab('Home'));
  }, [dispatch, router]);

  // Show loading or nothing while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  const handleScanQR = () => {
    router.push('/scan-car'); // Navigate to QR scanner page
  };

  const handleEnterPlate = () => {
    router.push('/enter-plate'); // Navigate to enter plate page
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    router.replace('/signin');
  };

  const CustomHomeHeader = () => (
    <header className="bg-neutral-50 p-4 sm:p-6 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <UserAvatar src="https://via.placeholder.com/40/FDB813/2C2C2E?text=J" /> {/* Replace with actual user image */}
        <div>
          <p className="text-lg font-semibold text-[#2C2C2E]">{user?.name ?? 'Guest'} 👋</p>
        </div>
      </div>
      <div className="mb-4 text-center">
        <span className="font-semibold">Current Balance:</span>{' '}
        <span className="text-lg text-green-600">{balance !== null ? `₦${balance}` : 'Loading...'}</span>
      </div>
      <div className="flex items-center space-x-2">
        <button className="p-2" onClick={handleLogout}>
          Logout
        </button>
        <button className="p-2">
          <HamburgerMenuIcon />
        </button>
      </div>
    </header>
  );

  return (
    <AppLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      customHeader={<CustomHomeHeader />}
      containerClassName="max-w-4xl mx-auto"
    >
      <div className="space-y-6 sm:space-y-8">
        {/* Scan QR Card */}
        {/* <Link href="/scan-car" passHref> */}
        <div className="bg-blue-600 p-6 rounded-xl shadow-lg text-white flex flex-col sm:flex-row items-center justify-between cursor-pointer hover:bg-blue-700 transition-colors" onClick={handleScanQR}>
          <div className="mb-4 sm:mb-0 sm:mr-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-1">Scan QR to Start Parking Session</h2>
            <p className="text-sm sm:text-base text-blue-100">
              Scan the QR code on site or enter your license plate number to find your session
            </p>
          </div>
          <div className="flex items-center space-x-4">
             {/* <a href="/qr-scan-page" target="_blank" rel="noopener noreferrer" className="block w-full max-w-2xl no-underline"> */}

            <PlaceholderQRCode />
            <div className="bg-green-500 p-3 rounded-full shadow-md">
              <ArrowRightIcon />
                  {/* </a> */}
            </div>
        
          </div>
          {/* </Link> */}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          <Link href="/wallet/topup" passHref>
            <p className="flex flex-col items-center justify-center bg-white p-4 sm:p-6 rounded-xl shadow hover:shadow-md transition-shadow text-center">
              <div className="bg-neutral-100 p-3 rounded-full mb-2">
                <PlusIcon />
              </div>
              <span className="text-sm font-medium text-[#2C2C2E]">Top up wallet</span>
            </p>
          </Link>
          <button className="flex flex-col items-center justify-center bg-white p-4 sm:p-6 rounded-xl shadow hover:shadow-md transition-shadow text-center">
            <div className="bg-neutral-100 p-3 rounded-full mb-2">
              <MoreIcon />
            </div>
            <span className="text-sm font-medium text-[#2C2C2E]">More</span>
          </button>
        </div>

        {/* Session Status */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-[#2C2C2E]">Session status</h3>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full
              ${sessionStatus === 'active' ? 'bg-green-100 text-green-700' : 
                sessionStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                'bg-neutral-100 text-neutral-700'}`}>
              {sessionStatus.charAt(0).toUpperCase() + sessionStatus.slice(1)}
            </span>
          </div>
          {sessionStatus === 'inactive' && (
            <p className="text-sm text-[#8A8A8E]">You have no active parking sessions.</p>
          )}
          {/* Add content for active/pending sessions here if needed */}
        </div>
        
        {/* Bottom Action Buttons */}
        <div className="space-y-4">
            <Button variant="primary" fullWidth onClick={handleScanQR}>
                Scan QR
            </Button>
            {/* <Button variant="secondary" fullWidth onClick={handleEnterPlate}>
                Enter plate number
            </Button> */}
        </div>
      </div>
    </AppLayout>
  );
};

export default HomePage;