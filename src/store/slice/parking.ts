import axios from 'axios';
import { BaseUrl } from '../../../config';
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

// Define the ParkingSession interface with additional fields from the API response
interface ParkingSession {
  id: string;
  plateNumber: string;
  vehicleType: string;
  entryTime: string; // ISO string or timestamp
  liveDuration?: string; // For active sessions, e.g., "00:47:12"
  feeSoFar?: number; // For active sessions
  status: string; // Flexible to accommodate "active", "pending_payment", etc.
  exitTime?: string; // For ended sessions
  durationInMinutes?: number; // For ended sessions
  calculatedFee?: number; // For ended sessions
}

// Define the structure for the ended session data, including payment result
interface EndedSessionData {
  session: ParkingSession;
  paymentResult: {
    successful: boolean;
    message: string;
  };
  message: string;
}

interface StartSessionPayload {
  plateNumber: string;
  vehicleType: string;
}

interface ParkingState {
  activeSession: ParkingSession | null;
  sessionHistory: ParkingSession[];
  lastEndedSession: EndedSessionData | null; // New property for leave session data
  isLoading: boolean;
  error: string | null;
}

const initialState: ParkingState = {
  activeSession: null,
  sessionHistory: [],
  lastEndedSession: null,
  isLoading: false,
  error: null,
};

// Function to map API session data to ParkingSession interface
const mapApiSessionToParkingSession = (apiSession: any): ParkingSession => ({
  id: apiSession._id,
  plateNumber: apiSession.vehiclePlateNumber,
  vehicleType: apiSession.vehicleType,
  entryTime: apiSession.entryTime,
  exitTime: apiSession.exitTime,
  durationInMinutes: apiSession.durationInMinutes,
  calculatedFee: apiSession.calculatedFee,
  status: apiSession.status,
  liveDuration: apiSession.liveDuration || undefined,
  feeSoFar: apiSession.feeSoFar || undefined,
});

export const startSession = createAsyncThunk(
  'parking/startSession',
  async (payload: StartSessionPayload, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        return rejectWithValue('No access token found');
      }
      const headers = { Authorization: `Bearer ${accessToken}` };
      const response = await axios.post(`${BaseUrl}/parking/session/start/plate`, payload, { headers });
      console.log('response', response.data);
      return mapApiSessionToParkingSession(response.data);
    } catch (error: any) {
      console.log("error", error);
      if (error.response?.status === 409) {
        return rejectWithValue('A parking session is already active for this vehicle');
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to start parking session');
    }
  }
);

export const fetchActiveSessionDetails = createAsyncThunk(
  'parking/fetchActiveSessionDetails',
  async (sessionId: string, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        return rejectWithValue('No access token found');
      }
      const headers = { Authorization: `Bearer ${accessToken}` };
      const response = await axios.get(`${BaseUrl}/api/v1/parking/session/${sessionId}`, { headers });
      return mapApiSessionToParkingSession(response.data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch session details');
    }
  }
);

export const endSession = createAsyncThunk(
  'parking/endSession',
  async (plateNumber: string, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        return rejectWithValue('No access token found');
      }
      const headers = { Authorization: `Bearer ${accessToken}` };
      const payload = { paymentMethodId: 'ghjghgkjgjh', paymentMethodType: 'card' };
      const response = await axios.put(`${BaseUrl}/parking/session/${plateNumber}/end`, payload, { headers });
      console.log('the data', response.data);
      const session = mapApiSessionToParkingSession(response.data.data.session);
      return {
        session,
        paymentResult: response.data.data.paymentResult,
        message: response.data.data.message,
      };
    } catch (error: any) {
      console.log('the error', error);
      console.error('Failed to end parking session:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to end parking session');
    }
  }
);

export const fetchSessionHistory = createAsyncThunk(
  'parking/fetchSessionHistory',
  async (_, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      console.log('Access Token:', accessToken);
      if (!accessToken) {
        return rejectWithValue('No access token found');
      }
      const headers = { Authorization: `Bearer ${accessToken}` };
      const response = await axios.get(`${BaseUrl}/parking/history`, { headers });
      console.log('Session History Response:', response.data);
      return response.data.map(mapApiSessionToParkingSession);
    } catch (error) {
      console.error('Failed to fetch session history:', error);
      return rejectWithValue('Failed to fetch session history');
    }
  }
);

export const parkingSlice = createSlice({
  name: 'parking',
  initialState,
  reducers: {
    updateLiveDuration: (state, action: PayloadAction<string>) => {
      if (state.activeSession) {
        state.activeSession.liveDuration = action.payload;
      }
    },
    clearActiveSession: (state) => {
      state.activeSession = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(startSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(startSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeSession = action.payload;
        state.error = null;
      })
      .addCase(startSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchActiveSessionDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchActiveSessionDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeSession = action.payload;
        state.error = null;
      })
      .addCase(fetchActiveSessionDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchSessionHistory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSessionHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sessionHistory = action.payload;
      })
      .addCase(fetchSessionHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to fetch session history';
      })
      .addCase(endSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(endSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lastEndedSession = action.payload; // Store the leave session data
        state.activeSession = null; // Clear active session
        state.error = null;
      })
      .addCase(endSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { updateLiveDuration, clearActiveSession } = parkingSlice.actions;
export default parkingSlice.reducer;