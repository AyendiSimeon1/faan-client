"use client";
import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import SessionList from '@/components/ui/SessionList';
import SessionItem from '@/components/ui/SessionItem';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchPayments } from '@/store/slice/payments';

const PaymentsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { payments, isLoading } = useAppSelector((state: { payments: { payments: any; isLoading: boolean } }) => state.payments);
  console.log('Payments state sdf:', payments);
  const [activeTab, setActiveTab] = useState<'Home' | 'Wallet' | 'History' | 'Payments'>('History');

  useEffect(() => {
    dispatch(fetchPayments());
  }, [dispatch]);

  // Adapt to new payments structure
  const paidSessions = Array.isArray(payments)
    ? payments.filter((p: any) => p.status && ["successful", "completed", "COMPLETED"].includes(p.status.toLowerCase()))
    : [];

  // Custom PaymentItem for richer display
  const PaymentItem = ({ payment }: { payment: any }) => {
    const session = payment.parkingSessionId || {};
    return (
      <div className="bg-white rounded-xl shadow-sm px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="text-lg font-medium text-[#2C2C2E]">
              {session.displayPlateNumber || session.vehiclePlateNumber || '-'}
              <span className="ml-2 text-xs text-neutral-400">({session.vehicleType || '-'})</span>
            </div>
            <div className="text-xs text-neutral-500">{session.rateDetails}</div>
          </div>
          <div className="flex flex-wrap gap-4 mt-2 text-sm text-neutral-600">
            <div>Entry: {session.entryTime ? new Date(session.entryTime).toLocaleString() : '-'}</div>
            <div>Exit: {session.exitTime ? new Date(session.exitTime).toLocaleString() : '-'}</div>
            <div>Duration: {session.durationInMinutes || 0} min</div>
            <div>Location: {session.parkingLocationId || '-'}</div>
          </div>
        </div>
        <div className="text-right min-w-[140px] mt-4 md:mt-0">
          <div className="text-lg font-semibold text-[#FDB813] mb-1">₦{payment.amount || session.calculatedFee || 0}</div>
          <div className="text-xs text-[#8A8A8E] mb-1 capitalize">{payment.paymentMethodType || 'Card'} • {payment.status}</div>
          <div className="text-xs text-[#8A8A8E]">{payment.currency || 'NGN'}</div>
          <div className="text-xs text-neutral-400 mt-1">Paid: {payment.createdAt ? new Date(payment.createdAt).toLocaleString() : '-'}</div>
          <div className="text-xs text-neutral-400 mt-1">Gateway Ref: {payment.gatewayReference}</div>
        </div>
      </div>
    );
  };

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
        <div>
          {paidSessions.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">💳</div>
              <p className="text-lg text-neutral-500 mb-2">No payments found.</p>
            </div>
          ) : (
            paidSessions.map((payment: any) => <PaymentItem key={payment._id} payment={payment} />)
          )}
        </div>
      )}
    </AppLayout>
  );
};

export default PaymentsPage;
