"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '../../components/layout/AppLayout';
import ScreenHeader from '../../components/ui/ScreenHeader';
import { RefreshIcon, ChevronRightSmallIcon, LogoutIcon, EditIcon, UserAvatar, PhoneIconSmall, EmailIconSmall } from '@/components/ui/Icon';

interface ProfileMenuItem {
  id: string;
  label: string;
  leftIcon?: React.ReactNode;
  rightIcon: React.ReactNode;
  onClick: () => void;
}

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'Home' | 'Wallet' | 'History' | 'Profile'>('Profile');

  const userProfile = {
    name: "Joy Miracle",
    plate: "ABJ356EP",
    phone: "07034568912",
    email: "joymiracle@gmail.com",
    avatarUrl: "https://i.pravatar.cc/150?u=joymiracle"
  };

  const menuItems: ProfileMenuItem[] = [
    { id: 'auto-debit', label: 'Auto-debit', rightIcon: <RefreshIcon />, onClick: () => {/* router.push('/profile/auto-debit-settings') */} },
    { id: 'access-help', label: 'Access help', rightIcon: <ChevronRightSmallIcon />, onClick: () => router.push('/support') },
    { id: 'settings', label: 'Settings', rightIcon: <ChevronRightSmallIcon />, onClick: () => router.push('/profile/settings') },
    { id: 'logout', label: 'Log out', rightIcon: <LogoutIcon />, onClick: () => { alert("Logout clicked"); router.push('/auth/sign-in'); } },
  ];

  const ProfileHeader = () => (
    <header className="bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
      <button 
        onClick={() => router.back()} 
        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors opacity-0 pointer-events-none"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>
      <h1 className="text-2xl font-bold text-gray-900 flex-grow text-center">My Profile</h1>
      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
        <EditIcon />
      </button>
    </header>
  );

  return (
    <AppLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      customHeader={<ProfileHeader />}
      containerClassName="max-w-4xl mx-auto px-8 py-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Info Card - Takes up left side on large screens */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center sticky top-8">
            <UserAvatar 
              src={userProfile.avatarUrl} 
              alt={userProfile.name} 
              sizeClassName="w-32 h-32 mx-auto mb-6" 
            />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{userProfile.name}</h2>
            <p className="text-base text-gray-500 mb-6 font-medium">{userProfile.plate}</p>
            
            <div className="space-y-3 text-left">
              <div className="flex items-center text-base text-gray-600">
                <PhoneIconSmall />
                <span className="ml-3">{userProfile.phone}</span>
              </div>
              <div className="flex items-center text-base text-gray-600">
                <EmailIconSmall />
                <span className="ml-3">{userProfile.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items - Takes up right side on large screens */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Account Settings</h3>
              <p className="text-gray-600 mt-1">Manage your account preferences and settings</p>
            </div>
            
            <div className="divide-y divide-gray-100">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={item.onClick}
                  className={`w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors group
                    ${item.id === 'logout' ? 'text-red-600 hover:bg-red-50' : 'text-gray-900'}
                  `}
                >
                  <div className="flex items-center">
                    <span className="text-base font-medium">{item.label}</span>
                  </div>
                  <div className={`transition-transform group-hover:translate-x-1 ${
                    item.id === 'logout' ? 'text-red-600' : 'text-gray-400'
                  }`}>
                    {item.rightIcon}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Additional Information Card */}
          <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6 mt-6">
            <h4 className="text-lg font-semibold text-blue-900 mb-2">Need Help?</h4>
            <p className="text-blue-700 mb-4">
              If you have any questions or need assistance with your account, our support team is here to help.
            </p>
            <button 
              onClick={() => router.push('/support')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProfilePage;