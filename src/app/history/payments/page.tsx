"use client";
import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import SessionList from '@/components/ui/SessionList';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchSessionHistory } from '@/store/slice/parking';

const PaymentsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { sessionHistory, isLoading } = useAppSelector(state => state.parking);
  const [activeTab, setActiveTab] = useState<'Home' | 'Wallet' | 'History' | 'Profile'>('History');

  useEffect(() => {
    dispatch(fetchSessionHistory());
  }, [dispatch]);

  const paidSessions = sessionHistory?.data?.filter((s: any) => s.paymentId && s.paymentId.status && ["successful", "completed", "COMPLETED"].includes(s.paymentId.status.toLowerCase())) || [];

  return (
    <AppLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      containerClassName="max-w-5xl mx-auto"
    >
      <h1 className="text-2xl font-bold mb-8 mt-4 text-center">All Payments</h1>
      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FDB813] mx-auto mb-4"></div>
            <p className="text-neutral-500">Loading payments...</p>
          </div>
        </div>
      ) : (
        <SessionList sessions={paidSessions} showPayment emptyText="No payments found." />
      )}
    </AppLayout>
  );
};

export default PaymentsPage;
