import React from 'react';
import SessionItem from './SessionItem';

interface PaymentDetails {
  _id: string;
  amount: number;
  paymentMethodType: string;
  status: string;
}

interface ParkingSession {
  _id: string;
  vehiclePlateNumber: string;
  displayPlateNumber?: string;
  vehicleType: string;
  entryTime: string;
  exitTime?: string;
  parkingLocationId: string;
  status: string;
  rateDetails: string;
  calculatedFee?: number;
  durationInMinutes?: number;
  paymentId?: PaymentDetails;
  amount?: any;
}

interface SessionListProps {
  sessions: ParkingSession[];
  showPayment?: boolean;
  emptyText?: string;
}

const SessionList: React.FC<SessionListProps> = ({ sessions, showPayment, emptyText }) => {
  if (!sessions || sessions.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🚗</div>
        <p className="text-lg text-neutral-500 mb-2">{emptyText || 'No sessions found'}</p>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <SessionItem key={session._id} session={session} showPayment={showPayment} />
      ))}
    </div>
  );
};

export default SessionList;
