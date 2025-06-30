// src/components/SidebarGateStatus.tsx

import React, { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import { 
  LuShieldOff, // Gate Closed
  LuShieldCheck, // Gate Open
  LuLoader, // Loading / Approaching
  LuCar, // Car Type
  LuCreditCard, // Plate Number
  LuRadar // Approaching Icon
} from 'react-icons/lu';

// Define a type for our status configuration for better type safety
type StatusConfig = {
  label: string;
  description: string;
  Icon: React.ElementType;
  color: 'red' | 'amber' | 'green';
  iconAnimation?: string;
};

// --- Custom Hook to handle the complex state logic ---
const useGateStatus = () => {
  const { carDetails, isLoading: carLoading } = useAppSelector((state) => state.car);
  const { activeSession, endedSession, isLoading: parkingLoading } = useAppSelector((state) => state.parking);

  // useMemo will re-calculate the status only when its dependencies change
  const statusInfo = useMemo(() => {
    if (carLoading || parkingLoading) {
      return {
        key: 'APPROACHING',
        details: null,
      };
    }
    if (carDetails && !activeSession?.data) {
      return {
        key: 'OPEN_ENTRY',
        details: {
          plate: carDetails.data?.plateNumber,
          type: carDetails.data?.carDetails?.type,
          model: carDetails.data?.carDetails?.model,
          imageUrl: carDetails.data?.imageUrl || carDetails.data?.image || '', // fallback to .image if .imageUrl is not present
        },
      };
    }
    if (activeSession?.data) {
      return {
        key: 'OPEN_ACTIVE',
        details: {
          plate: activeSession.data?.vehiclePlateNumber,
          type: activeSession.data?.vehicleType,
          model: 'N/A', // Assuming model isn't in active session
          imageUrl: carDetails?.data?.imageUrl || carDetails?.data?.image || '', // fallback to .image if .imageUrl is not present
        },
      };
    }
    if (endedSession) {
      return {
        key: 'CLOSED_ENDED',
        details: null,
      };
    }
    return {
      key: 'CLOSED_IDLE',
      details: null,
    };
  }, [carLoading, parkingLoading, carDetails, activeSession, endedSession]);
  
  // Configuration object for all possible statuses
  const STATUS_CONFIG: Record<string, StatusConfig> = {
    APPROACHING: {
      label: 'Car Approaching',
      description: 'Scanning vehicle...',
      Icon: LuLoader,
      color: 'amber',
      iconAnimation: 'animate-spin',
    },
    OPEN_ENTRY: {
      label: 'Gate Open',
      description: 'Vehicle verified. Welcome!',
      Icon: LuShieldCheck,
      color: 'green',
    },
    OPEN_ACTIVE: {
      label: 'Gate Open',
      description: 'Vehicle inside. Have a good flight!',
      Icon: LuShieldCheck,
      color: 'green',
    },
    CLOSED_ENDED: {
      label: 'Gate Closed',
      description: 'Session ended. Thank you!',
      Icon: LuShieldOff,
      color: 'red',
    },
    CLOSED_IDLE: {
      label: 'Gate Closed',
      description: 'Awaiting vehicle approach.',
      Icon: LuShieldOff,
      color: 'red',
    },
  };

  const currentStatus = STATUS_CONFIG[statusInfo.key];
  
  // Define color mappings for TailwindCSS
  const colorMap = {
    red: 'text-red-400 bg-red-900/50 border-red-500/30',
    amber: 'text-amber-400 bg-amber-900/50 border-amber-500/30',
    green: 'text-green-400 bg-green-900/50 border-green-500/30',
  };

  return {
    ...currentStatus,
    details: statusInfo.details,
    colorClasses: colorMap[currentStatus.color],
  };
};


// --- The Beautiful New Component ---
const SidebarGateStatus: React.FC = () => {
  const { label, description, Icon, iconAnimation, details, colorClasses } = useGateStatus();

  return (
    <div className="mt-8 w-full bg-gray-800 border border-gray-700 rounded-2xl p-6 flex flex-col items-center text-center shadow-2xl shadow-gray-900/50 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:36px_36px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
      
      {/* Status Indicator */}
      <div className={`relative w-28 h-28 mb-4 rounded-full flex items-center justify-center border ${colorClasses} transition-all duration-300`}>
        {/* Pulsing glow effect */}
        {label === 'Car Approaching' && <div className={`absolute inset-0 rounded-full ${colorClasses.split(' ')[1]} animate-pulse`}></div>}
        <Icon className={`text-6xl z-10 ${iconAnimation || ''}`} />
      </div>

      {/* Status Text */}
      <h3 className="text-xl font-bold text-white tracking-wide">{label}</h3>
      <p className="text-sm text-gray-400 mt-1">{description}</p>

      {/* Details Section (conditionally rendered) */}
      {details && (
        <div className="w-full mt-6 pt-5 border-t border-gray-700/50 animate-fade-in">
          <div className="flex items-center space-x-4 bg-gray-900/70 p-3 rounded-lg">
            <div className="w-20 h-14 flex-shrink-0 bg-gray-800 rounded-md overflow-hidden flex items-center justify-center">
              {details.imageUrl ? (
                <img src={details.imageUrl} alt="Vehicle" className="w-full h-full object-cover" />
              ) : (
                <LuCar className="text-gray-500 text-3xl" />
              )}
            </div>
            <div className="text-left text-xs">
              <div className="flex items-center text-gray-300">
                <LuCreditCard className="mr-2 text-gray-500" />
                Plate: <span className="font-semibold ml-1 text-white">{details.plate || 'N/A'}</span>
              </div>
              <div className="flex items-center mt-1 text-gray-300">
                <LuCar className="mr-2 text-gray-500" />
                Type: <span className="font-semibold ml-1 text-white">{details.type || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
        
      {/* Airport branding */}
      <div className="absolute bottom-3 right-5 text-[10px] text-gray-500 font-semibold tracking-widest select-none">FAAN AIRPORT PARKING</div>
    </div>
  );
};

// Add this to your tailwind.config.js if you don't have it, for the fade-in animation
// keyframes: {
//   'fade-in': {
//     '0%': { opacity: '0', transform: 'translateY(10px)' },
//     '100%': { opacity: '1', transform: 'translateY(0)' },
//   },
// },
// animation: {
//   'fade-in': 'fade-in 0.5s ease-out forwards',
// },

export default SidebarGateStatus;