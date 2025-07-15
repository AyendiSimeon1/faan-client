"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '../components/layout/AppLayout';
import Button from '../components/ui/Button';
import Link from 'next/link';
import { ArrowRightIcon, HamburgerMenuIcon, MoreIcon, PlaceholderQRCode, PlusIcon, UserAvatar } from '@/components/ui/Icon';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setActiveBottomTab } from '@/store/slice/ui';
import 'react-toastify/dist/ReactToastify.css';
import { fetchWalletBalance } from '@/store/slice/wallet';
import { logout } from '@/store/slice/auth';

const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  // --- State Selectors ---
  const { user, isAuthenticated } = useAppSelector(state => state.auth);
  const { balance } = useAppSelector((state) => state.wallet);
  const [activeTab, setActiveTab] = useState<'Home' | 'Wallet' | 'History' | 'Payments'>('Home');
  const [sessionStatus, setSessionStatus] = useState<'inactive' | 'active' | 'pending'>('inactive');
  const [isClient, setIsClient] = useState(false);

  // --- Effect for Client-side Hydration ---
  useEffect(() => {
    setIsClient(true);
  }, []);

  // --- Effect for Handling Authentication State ---
  useEffect(() => {
    // Only run on client side after hydration
    if (!isClient) return;
    
    // On component mount or when isAuthenticated changes, check the state.
    // If not authenticated and no token exists, redirect to signin.
    // This prevents the loop and handles the redirection after logout.
    if (!isAuthenticated && !localStorage.getItem('accessToken')) {
      router.replace('/signin');
    }
  }, [isAuthenticated, router, isClient]);

  // --- Effect for Initial Data Fetching ---
  useEffect(() => {
    // Only fetch data if the user is authenticated.
    if (isAuthenticated) {
      dispatch(fetchWalletBalance());
      dispatch(setActiveBottomTab('Home'));
    }
  }, [dispatch, isAuthenticated]);

  // --- Event Handlers ---
  const handleScanQR = () => {
    router.push('/scan-car'); // Navigate to QR scanner page
  };

  const handleLogout = () => {
    // Simply dispatch the logout action. The useEffect above will handle the redirect.
    dispatch(logout());
  };

  // --- Custom Header Component ---
  const CustomHomeHeader = () => (
    <header className="bg-neutral-50 p-4 sm:p-6 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <UserAvatar src="https://via.placeholder.com/40/FDB813/2C2C2E?text=J" /> {/* Replace with actual user image */}
        <div>
          <p className="text-lg font-semibold text-[#2C2C2E]">{user?.name ?? 'Guest'} 👋</p>
        </div>
      </div>
      <div className="text-center">
        <span className="font-semibold">Current Balance:</span>{' '}
        <span className="text-lg text-green-600">{balance !== null ? `₦${balance}` : 'Loading...'}</span>
      </div>
      <div className="flex items-center space-x-2">
        <button 
          className="
            flex items-center gap-2 px-4 py-2 
            bg-red-500 hover:bg-red-600 active:bg-red-700
            text-white font-medium text-sm
            rounded-lg shadow-sm hover:shadow-md
            border border-red-500 hover:border-red-600
            transition-all duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed
          " 
          onClick={handleLogout}
        >
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
            />
          </svg>
          Logout
        </button>
        <button className="p-2">
          <HamburgerMenuIcon />
        </button>
      </div>
    </header>
  );

  // --- Render Logic ---

  // Show loading while client is hydrating
  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // While user is being logged out or if auth state is not yet confirmed, show a loading/redirecting screen.
  // This prevents rendering the main content with stale data.
  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to sign-in...</p>
        </div>
      </div>
    );
  }

  return (
    <AppLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      customHeader={<CustomHomeHeader />}
      containerClassName="max-w-4xl mx-auto"
    >
      <div className="space-y-6 sm:space-y-8">
        {/* Scan QR Card */}
        <div className="bg-blue-600 p-6 rounded-xl shadow-lg text-white flex flex-col sm:flex-row items-center justify-between cursor-pointer hover:bg-blue-700 transition-colors" onClick={handleScanQR}>
          <div className="mb-4 sm:mb-0 sm:mr-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-1">Scan QR to Start Parking Session</h2>
            <p className="text-sm sm:text-base text-blue-100">
              Scan the QR code on site or enter your license plate number to find your session
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <PlaceholderQRCode />
            <div className="bg-green-500 p-3 rounded-full shadow-md">
              <ArrowRightIcon />
            </div>
          </div>
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
        {/* <div className="bg-white p-4 sm:p-6 rounded-xl shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-[#2C2C2E]">Session status</h3>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full
              ${sessionStatus === 'active' ? 'bg-green-100 text-green-700' :
                sessionStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                'bg-neutral-100 text-neutral-700'}`}>
              {sessionStatus.charAt(0).toUpperCase() + sessionStatus.slice(1)}
            </span>
          </div> */}
          {/* {sessionStatus === 'inactive' && (
            <p className="text-sm text-[#8A8A8E]">You have no active parking sessions.</p>
          )} */}
        {/* </div> */}

        {/* Bottom Action Buttons */}
        {/* <div className="space-y-4">
            <Button variant="primary" fullWidth onClick={handleScanQR}>
                Scan QR
            </Button>
        </div> */}
      </div>
    </AppLayout>
  );
};

export default HomePage;