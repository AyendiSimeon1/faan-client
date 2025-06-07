import React from 'react';

// Placeholder Icons - Replace as needed
const ParkingIcon = () => <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-500">P</div>;
const WalletAddIcon = () => <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-500">W+</div>;
const TransferIcon = () => <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-500">T</div>;
const FailedIcon = () => <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-500">X</div>;

interface TransactionItemProps {
  type: 'Parking space' | 'Money added to wallet' | 'Transfer' | string; // Allow custom types
  description?: string; // e.g., Mastercard****1234
  amount: string;
  date: string;
  status: 'successful' | 'pending' | 'failed';
  className?: string;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  type,
  description,
  amount,
  date,
  status,
  className = '',
}) => {
  let icon: React.ReactNode;
  let amountColor = 'text-[#2C2C2E]';

  switch (status) {
    case 'successful':
      if (type === 'Parking space' || type === 'Transfer') icon = <ParkingIcon />; // Assuming transfer out
      else if (type === 'Money added to wallet') icon = <WalletAddIcon />;
      else icon = <ParkingIcon />; // Default
      if (amount.startsWith('+') || type === 'Money added to wallet') amountColor = 'text-green-600';
      else if (amount.startsWith('-')) amountColor = 'text-red-600';
      break;
    case 'pending':
      icon = <ParkingIcon />; // Or a specific pending icon
      amountColor = 'text-neutral-500';
      break;
    case 'failed':
      icon = <FailedIcon />;
      amountColor = 'text-red-600 line-through';
      break;
    default:
      icon = <ParkingIcon />;
  }

  return (
    <div className={`flex items-center p-4 bg-white ${className}`}>
      <div className="mr-3 flex-shrink-0">{icon}</div>
      <div className="flex-grow">
        <p className="text-base font-medium text-[#2C2C2E]">{type}</p>
        <p className="text-sm text-[#8A8A8E]">{description || date}</p>
      </div>
      <div className={`ml-3 text-right ${amountColor}`}>
        <p className="text-base font-semibold">{amount}</p>
        {description && <p className="text-xs text-[#8A8A8E]">{date}</p>}
      </div>
    </div>
  );
};

export default TransactionItem;