"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import Button from '@/components/ui/Button';
import { MastercardIcon, VisaIcon, ParkingSpaceIcon, TransferActivityIcon, WalletAddActivityIcon, FilterIcon } from '@/components/ui/Icon';

type TransactionStatus = 'successful' | 'pending' | 'failed';
type TransactionType = 'Parking space' | 'Transfer' | 'Money added to wallet';

interface Transaction {
  id: string;
  type: TransactionType;
  descriptionIcon?: React.ReactNode;
  description: string;
  amount: string;
  date: string;
  status: TransactionStatus;
}

const mockTransactions: Transaction[] = [
  { id: 't1', type: 'Parking space', descriptionIcon: <MastercardIcon/>, description: 'Mastercard****540', amount: '-₦1,600', date: '13/05/2025', status: 'successful' },
  { id: 't2', type: 'Parking space', descriptionIcon: <MastercardIcon/>, description: 'Mastercard****540', amount: '-₦1,600', date: '13/05/2025', status: 'successful' },
  { id: 't3', type: 'Parking space', descriptionIcon: <MastercardIcon/>, description: 'Mastercard****540', amount: '-₦1,600', date: '13/05/2025', status: 'successful' },
  { id: 't4', type: 'Parking space', descriptionIcon: <VisaIcon/>, description: 'VISA****540', amount: '-₦1,600', date: '13/05/2025', status: 'failed' },
  { id: 't5', type: 'Parking space', description: 'Transfer', amount: '-₦1,600', date: '13/05/2025', status: 'pending' },
  { id: 't6', type: 'Money added to wallet', description: 'Transfer', amount: '₦5,000', date: '13/05/2025', status: 'successful' },
  { id: 't7', type: 'Parking space', descriptionIcon: <VisaIcon/>, description: 'VISA****540', amount: '-₦1,600', date: '13/05/2025', status: 'failed' },
  { id: 't8', type: 'Parking space', descriptionIcon: <MastercardIcon/>, description: 'Mastercard****540', amount: '-₦1,600', date: '13/05/2025', status: 'successful' },
];

const TransactionHistoryPage: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'Home' | 'Wallet' | 'History' | 'Payments'>('History');
  const [filter, setFilter] = useState<'All' | 'successful' | 'pending'>('All');

  const filteredTransactions = mockTransactions.filter(tx => {
    if (filter === 'All') return true;
    return tx.status === filter;
  });
  
  const getTransactionIcon = (type: TransactionType, status: TransactionStatus) => {
    if (type === 'Parking space') return <ParkingSpaceIcon status={status} />;
    if (type === 'Transfer') return <TransferActivityIcon />;
    if (type === 'Money added to wallet') return <WalletAddActivityIcon />;
    return null;
  };

  return (
    <AppLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      headerProps={{ title: "My Transactions", onBack: () => router.back(), showBackButton: true }}
      containerClassName="max-w-3xl mx-auto"
    >
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div className="flex space-x-2">
          {(['All', 'successful', 'pending'] as const).map(f => (
            <Button
              key={f}
              variant={filter === f ? 'primary' : 'tertiary'}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm sm:text-base rounded-full 
                ${filter === f ? '!bg-[#2C2C2E] !text-white' : '!bg-neutral-200 !text-[#2C2C2E]'}
              `}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </div>
        <Button variant="tertiary" className="p-2 !bg-neutral-200">
          <FilterIcon />
        </Button>
      </div>

      <div className="space-y-3">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map(tx => (
            <div key={tx.id} className="bg-white rounded-xl shadow p-4 flex items-center">
              <div className="mr-3 sm:mr-4 flex-shrink-0">
                {getTransactionIcon(tx.type, tx.status)}
              </div>
              <div className="flex-grow">
                <p className="text-sm sm:text-base font-semibold text-[#2C2C2E]">{tx.type}</p>
                <div className="flex items-center text-xs sm:text-sm text-[#8A8A8E]">
                  {tx.descriptionIcon && <span className="mr-1 h-4 w-6 flex items-center">{tx.descriptionIcon}</span>}
                  {tx.description}
                </div>
              </div>
              <div className="ml-3 text-right">
                <p className={`text-sm sm:text-base font-semibold ${tx.amount.startsWith('₦5') ? 'text-green-600' : 'text-[#2C2C2E]'}`}>
                  {tx.amount}
                </p>
                <p className="text-xs text-[#8A8A8E]">{tx.date}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-neutral-500 py-10">No transactions found for this filter.</p>
        )}
      </div>
    </AppLayout>
  );
};

export default TransactionHistoryPage;