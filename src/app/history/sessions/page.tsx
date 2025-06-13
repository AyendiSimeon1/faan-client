"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import Button from '@/components/ui/Button';
import { EditIcon, SearchIcon, DateFilterIcon, ParkingLocationIcon, DownloadReceiptIcon } from '@/components/ui/Icon';
import { fetchSessionHistory } from '@/store/slice/parking';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

interface PaymentDetails {
  _id: string;
  amount: number;
  paymentMethodType: string;
  status: string;
}

interface ParkingSession {
  _id: string;
  userId: string;
  vehiclePlateNumber: string;
  vehicleType: string;
  entryTime: string;
  exitTime?: string;
  parkingLocationId: string;
  parkingSessionId?: any;
  qrCodeId: string;
  status: string;
  rateDetails: string;
  isAutoDebit: boolean;
  createdAt: string;
  updatedAt: string;
  calculatedFee?: number;
  durationInMinutes?: number;
  paymentId?: PaymentDetails;
  amount?: any;
}

interface SessionsResponse {
  status: string;
  data: ParkingSession[]; // Fixed: Direct array, not nested object
}

const formatDateTime = (dateString: string) => {
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

const formatSessionDetails = (session: any) => {
  const entryTime = formatDateTime(session.entryTime);
  const exitTime = session.exitTime ? formatDateTime(session.exitTime) : 'Ongoing';
  return `${entryTime} - ${exitTime}`;
};

// Fixed: Uncommented and improved getLocationName function
const getLocationName = (locationId: string) => {
  // You might want to maintain a mapping of location IDs to names
  // For now, we'll use a simple transformation
  if (!locationId) return 'Unknown Location';
  
  // Handle different location ID formats
  if (locationId.includes('qr_')) {
    return 'Parking Location'; // Default name for QR-based locations
  }
  
  // Transform location ID to readable name
  return locationId
    .replace('loc_', '')
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ') || 'Parking Location';
};

const groupSessionsByDate = (sessions: ParkingSession) => {
  const groups: { [key: string]: ParkingSession[] } = {};
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
   if (!Array.isArray(sessions)) {
      return groups;
    }


  sessions.forEach(session => {
    const sessionDate = new Date(session.createdAt);
    const isToday = sessionDate.toDateString() === today.toDateString();
    const isYesterday = sessionDate.toDateString() === yesterday.toDateString();
    
    
    let groupKey: string;
    if (isToday) {
      groupKey = 'Today';
    } else if (isYesterday) {
      groupKey = 'Yesterday';
    } else {
      groupKey = sessionDate.toLocaleDateString('en-GB', { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
    
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(session);
  });
  
  return groups;
};

const ParkingHistorySessionPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { pastSessions, sessionHistory, isLoading } = useAppSelector(state => state.parking);
  const [activeTab, setActiveTab] = useState<'Home' | 'Wallet' | 'History' | 'Profile'>('History');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchSessionHistory());
  }, [dispatch]);

  console.log('Past Sessions:', pastSessions);
  console.log('Session history:', sessionHistory);

  // Fixed: Proper data structure handling and search logic
  const filteredAndGroupedSessions = useMemo(() => {
    // Check if sessionHistory exists and has data array
    if (!sessionHistory?.data || !Array.isArray(sessionHistory.data)) {
      return {};
    }
    
    const filtered = sessionHistory.data.filter((session: ParkingSession) => {
      const searchLower = searchTerm.toLowerCase().trim();
      
      // If no search term, show all sessions
      if (!searchLower) return true;
      
      // Safe check for plate number
      const plateMatches = session.vehiclePlateNumber 
        ? session.vehiclePlateNumber.toLowerCase().includes(searchLower)
        : false;
        
      // Safe check for location
      const locationMatches = session.parkingLocationId
        ? getLocationName(session.parkingLocationId).toLowerCase().includes(searchLower)
        : false;
        
      return plateMatches || locationMatches;
    });
    
    return groupSessionsByDate(filtered);
  }, [sessionHistory, searchTerm]);

  const HistoryHeader = () => (
    <header className="bg-neutral-50 px-6 py-5 flex items-center justify-between sticky top-0 z-10 border-b border-neutral-200">
      <button onClick={() => router.back()} className="p-2 text-[#2C2C2E] hover:bg-neutral-100 rounded-lg">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <h1 className="text-2xl font-semibold text-[#2C2C2E] text-center flex-grow">Past Sessions</h1>
      <button className="p-2 hover:bg-neutral-100 rounded-full">
        <EditIcon />
      </button>
    </header>
  );

  if (isLoading) {
    return (
      <AppLayout
        activeTab={activeTab}
        onTabChange={setActiveTab}
        customHeader={<HistoryHeader />}
        containerClassName="max-w-5xl mx-auto"
      >
        <div className="flex justify-center items-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FDB813] mx-auto mb-4"></div>
            <p className="text-neutral-500">Loading sessions...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Check if we have any sessions at all
  const hasAnySessions = sessionHistory?.data && Array.isArray(sessionHistory.data) && sessionHistory.data.length > 0;
  const hasFilteredSessions = Object.values(filteredAndGroupedSessions).some(arr => arr.length > 0);

  return (
    <AppLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      customHeader={<HistoryHeader />}
      containerClassName="max-w-5xl mx-auto"
    >
      {/* Search and Filter */}
      <div className="mb-10 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[300px]">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Search by location or plate number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 text-base bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-[#FDB813] focus:border-[#FDB813] outline-none shadow"
          />
        </div>
        <Button
          variant="secondary"
          onClick={() => alert("Date filter clicked")}
          className="!bg-white !border-neutral-200 shadow hover:!bg-neutral-100 px-6 py-3 text-base"
          leftIcon={<DateFilterIcon />}
        >
          Date Filter
        </Button>
      </div>

      {/* Session List */}
      {hasFilteredSessions ? (
        Object.entries(filteredAndGroupedSessions).map(([groupName, sessions]) => (
          sessions.length > 0 && (
            <div key={groupName} className="mb-10">
              <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-4">{groupName}</h2>
              <div className="space-y-4">
                {sessions.map(session => (
                  <div
                    key={session._id}
                    className="bg-white rounded-xl shadow-sm px-6 py-5 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <ParkingLocationIcon />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-[#2C2C2E]">
                          {/* {getLocationName(session.parkingLocationId)} */}
                          {session.parkingSessionId.vehicleType}
                        </p>
                        <p className="text-sm text-[#8A8A8E]">
                          Entry Time: {formatDateTime(session.parkingSessionId.entryTime)}
                        </p>
                        <p className="text-sm text-[#8A8A8E]">
                          Exit Time: {session.parkingSessionId.exitTime ? formatDateTime(session.parkingSessionId.exitTime) : 'Ongoing'}
                        </p>
                        <p className="text-xs text-[#8A8A8E] mt-1">
                          {session.parkingSessionId.vehiclePlateNumber || 'No plate number'} • {session.rateDetails}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-[#FDB813] mb-1">
                        -₦{session.amount || session.paymentId?.amount || 0}
                      </p>
                      <p className="text-xs text-[#8A8A8E] mb-2">
                        {session.status === 'completed' ? 'Completed' : 'Ongoing'}
                      </p>
                      <button
                        onClick={() => alert(`Download receipt for ${getLocationName(session.parkingLocationId)}`)}
                        className="p-2 hover:bg-neutral-100 rounded-full"
                      >
                        <DownloadReceiptIcon />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        ))
      ) : (
        <div className="text-center py-16">
          {!hasAnySessions ? (
            <div>
              <div className="text-6xl mb-4">🚗</div>
              <p className="text-lg text-neutral-500 mb-2">No parking sessions yet</p>
              <p className="text-sm text-neutral-400">Your parking history will appear here</p>
            </div>
          ) : (
            <div>
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-lg text-neutral-500 mb-2">No sessions match your search</p>
              <p className="text-sm text-neutral-400">Try adjusting your search terms</p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-4 px-4 py-2 bg-[#FDB813] text-white rounded-lg hover:bg-[#FDB813]/90"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </AppLayout>
  );
};

export default ParkingHistorySessionPage;