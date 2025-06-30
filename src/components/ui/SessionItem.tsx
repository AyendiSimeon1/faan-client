import React from 'react';

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

interface SessionItemProps {
  session: ParkingSession;
  showPayment?: boolean;
}

const formatDateTime = (dateString: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';
  const displayHours = hours % 12 || 12;
  return `${day}/${month}/${year}, ${displayHours}:${minutes}${ampm}`;
};

const SessionItem: React.FC<SessionItemProps> = ({ session, showPayment }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm px-6 py-5 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <p className="text-lg font-medium text-[#2C2C2E]">
            {session.displayPlateNumber || session.vehiclePlateNumber} <span className="ml-2 text-xs text-neutral-400">({session.vehicleType})</span>
          </p>
          <p className="text-sm text-[#8A8A8E]">
            Entry: {formatDateTime(session.entryTime)}
          </p>
          <p className="text-sm text-[#8A8A8E]">
            Exit: {session.exitTime ? formatDateTime(session.exitTime) : 'Ongoing'}
          </p>
          <p className="text-xs text-[#8A8A8E] mt-1">
            {session.rateDetails}
          </p>
        </div>
      </div>
      <div className="text-right min-w-[120px]">
        <p className="text-lg font-semibold text-[#FDB813] mb-1">
          ₦{session.calculatedFee || session.amount || session.paymentId?.amount || 0}
        </p>
        {showPayment && session.paymentId && (
          <>
            <p className="text-xs text-[#8A8A8E] mb-1 capitalize">
              {session.paymentId.paymentMethodType} • {session.paymentId.status}
            </p>
          </>
        )}
        <p className="text-xs text-[#8A8A8E] mb-2 capitalize">
          {session.status}
        </p>
      </div>
    </div>
  );
};

export default SessionItem;
