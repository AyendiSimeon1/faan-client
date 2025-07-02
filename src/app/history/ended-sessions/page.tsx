"use client";
import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import SessionList from '@/components/ui/SessionList';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchSessionHistory } from '@/store/slice/parking';

const EndedSessionsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { sessionHistory, isLoading } = useAppSelector(state => state.parking);
  const [activeTab, setActiveTab] = useState<'Home' | 'Wallet' | 'History' | 'Payments'>('History');

  useEffect(() => {
    dispatch(fetchSessionHistory());
  }, [dispatch]);

  // Only show ended sessions (status === 'completed')
  const endedSessions = sessionHistory?.data?.filter((s: any) => s.status?.toLowerCase() === 'completed') || [];

  return (
    <AppLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      containerClassName="max-w-5xl mx-auto"
    >
      <h1 className="text-2xl font-bold mb-8 mt-4 text-center">Ended Parking Sessions</h1>
      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FDB813] mx-auto mb-4"></div>
            <p className="text-neutral-500">Loading sessions...</p>
          </div>
        </div>
      ) : (
        <SessionList sessions={endedSessions} emptyText="No ended sessions found." />
      )}
    </AppLayout>
  );
};

export default EndedSessionsPage;
