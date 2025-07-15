"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '../../components/layout/AppLayout';
import ScreenHeader from '../../components/ui/ScreenHeader';
import { fetchWalletBalance } from '@/store/slice/wallet';
import { CardPaymentIcon, WalletTopUpIcon, PlusIcon, AutoDebitIcon, TopUpIcon } from '@/components/ui/Icon';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

interface ActivityItem {
  id: string;
  type: 'Card payment' | 'Top up';
  description: string;
  date: string;
  amount: string;
  icon: React.ReactNode;
  status?: 'completed' | 'pending' | 'failed';
}

const mockActivities: ActivityItem[] = [
  { 
    id: 'a1', 
    type: 'Card payment', 
    description: 'Parking of vehicle at Lagos Airport Terminal 2', 
    date: '15/05/2025', 
    amount: '-₦1,600', 
    icon: <CardPaymentIcon />,
    status: 'completed'
  },
  { 
    id: 'a2', 
    type: 'Top up', 
    description: 'Added money to wallet via Bank Transfer', 
    date: '15/05/2025', 
    amount: '+₦25,000', 
    icon: <WalletTopUpIcon />,
    status: 'completed'
  },
  { 
    id: 'a3', 
    type: 'Card payment', 
    description: 'Parking of vehicle at Murtala Mohammed Airport Terminal 1', 
    date: '14/05/2025', 
    amount: '-₦2,400', 
    icon: <CardPaymentIcon />,
    status: 'completed'
  },
  { 
    id: 'a4', 
    type: 'Top up', 
    description: 'Added money to wallet via Debit Card', 
    date: '13/05/2025', 
    amount: '+₦10,000', 
    icon: <WalletTopUpIcon />,
    status: 'pending'
  },
  { 
    id: 'a5', 
    type: 'Card payment', 
    description: 'Parking of vehicle at Nnamdi Azikiwe Airport', 
    date: '12/05/2025', 
    amount: '-₦1,800', 
    icon: <CardPaymentIcon />,
    status: 'completed'
  },
];

const WalletPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { balance } = useAppSelector((state) => state.wallet);
  const { user, isAuthenticated } = useAppSelector(state => state.auth);
  const [activeTab, setActiveTab] = useState<'Home' | 'Wallet' | 'History' | 'Payments'>('Wallet');

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'failed': return 'text-red-600';
      default: return 'text-neutral-600';
    }
  };

  const getAmountColor = (amount: string) => {
    return amount.startsWith('+') ? 'text-green-600' : 'text-red-500';
  };
  useEffect(() => {
      // Only fetch data if the user is authenticated.
      if (isAuthenticated) {
        dispatch(fetchWalletBalance());
       
      }
    }, [dispatch, isAuthenticated]);

  return (
    <AppLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      headerProps={{ 
        title: "Wallet Management", 
        onBack: () => router.back(), 
        showBackButton: true 
      }}
      containerClassName=""
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Section - Balance and Quick Actions */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Current Balance Card */}
          <div className="xl:col-span-2">
            <div className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-black text-white rounded-2xl shadow-2xl p-8 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-[#FDB813] to-transparent opacity-10 rounded-full"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-tl from-[#FDB813] to-transparent opacity-15 rounded-full"></div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-neutral-300 text-lg mb-2">Available Balance</p>
                    <p className="text-5xl font-bold mb-1">
                    {balance !== null
                      ? `₦${balance.toLocaleString()}`
                      : 'Loading...'}
                  </p>
                    <p className="text-[#FDB813] font-medium">Nigerian Naira</p>
                  </div>
                  <div className="text-right">
                    <p className="text-neutral-400 text-sm">Last Updated</p>
                    <p className="text-neutral-200 text-sm">Today, 2:45 PM</p>
                  </div>
                </div>
                
                {/* Mini stats */}
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-neutral-700">
                  {/* <div>
                    <p className="text-neutral-400 text-sm">This Month Spent</p>
                    <p className="text-red-400 font-semibold text-lg">-₦15,800</p>
                  </div>
                  <div>
                    <p className="text-neutral-400 text-sm">This Month Added</p>
                    <p className="text-green-400 font-semibold text-lg">+₦35,000</p>
                  </div> */}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-neutral-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {[
                { 
                  label: 'Add Payment Method', 
                  icon: <PlusIcon />, 
                  onClick: () => router.push('wallet/topup'),
                  description: 'Link a new card or bank account',
                  color: 'bg-blue-500 hover:bg-blue-600'
                },
                { 
                  label: 'Enable Auto-Debit', 
                  icon: <AutoDebitIcon />, 
                  onClick: () => {/* router.push('/settings/auto-debit') */},
                  description: 'Automatic balance top-ups',
                  color: 'bg-purple-500 hover:bg-purple-600'
                },
                { 
                  label: 'Top Up Wallet', 
                  icon: <TopUpIcon />, 
                  onClick: () => router.push('/wallet/topup'),
                  description: 'Add money to your wallet',
                  color: 'bg-green-500 hover:bg-green-600'
                },
              ].map(action => (
                <button
                  key={action.label}
                  onClick={action.onClick}
                  className={`w-full flex items-center p-4 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 ${action.color} text-white group`}
                >
                  <div className="flex-shrink-0 text-2xl mr-4 group-hover:scale-110 transition-transform">
                    {action.icon}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-base">{action.label}</p>
                    <p className="text-sm opacity-90">{action.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-neutral-800">Recent Activity</h2>
            <button className="text-[#FDB813] hover:text-[#E5A712] font-medium transition-colors">
              View All Transactions →
            </button>
          </div>

          {/* Activity List */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-neutral-100">
            <div className="divide-y divide-neutral-100">
              {mockActivities.map((activity, index) => (
                <div 
                  key={activity.id} 
                  className="p-6 hover:bg-neutral-50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center">
                    {/* Icon */}
                    <div className="flex-shrink-0 mr-5">
                      <div className="w-12 h-12 bg-neutral-100 group-hover:bg-neutral-200 rounded-full flex items-center justify-center transition-colors">
                        <div className="text-xl">{activity.icon}</div>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-neutral-800">
                          {activity.type}
                        </h3>
                        {activity.status && (
                          <span className={`text-xs px-2 py-1 rounded-full bg-neutral-100 ${getStatusColor(activity.status)}`}>
                            {activity.status}
                          </span>
                        )}
                      </div>
                      <p className="text-neutral-600 text-base mb-1">{activity.description}</p>
                      <p className="text-neutral-500 text-sm">{activity.date}</p>
                    </div>
                    
                    {/* Amount */}
                    <div className="text-right ml-4">
                      <p className={`text-xl font-bold ${getAmountColor(activity.amount)}`}>
                        {activity.amount}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <h4 className="text-lg font-semibold text-blue-800 mb-2">Security</h4>
            <p className="text-blue-600 text-sm mb-3">Your transactions are protected with bank-level security</p>
            <button className="text-blue-700 font-medium text-sm hover:underline">Learn more →</button>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
            <h4 className="text-lg font-semibold text-green-800 mb-2">Rewards</h4>
            <p className="text-green-600 text-sm mb-3">Earn points on every transaction you make</p>
            <button className="text-green-700 font-medium text-sm hover:underline">View rewards →</button>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
            <h4 className="text-lg font-semibold text-purple-800 mb-2">Support</h4>
            <p className="text-purple-600 text-sm mb-3">Need help? Our support team is here 24/7</p>
            <button className="text-purple-700 font-medium text-sm hover:underline">Get help →</button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default WalletPage;