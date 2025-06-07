import axios from 'axios';
import { BaseUrl } from '../../../config'
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

interface ParkingSession {
  id: string;
  plateNumber: string;
  vehicleType: string;
  entryTime: string; // ISO string or timestamp
  liveDuration: string; // Formatted string e.g., "00:47:12"
  feeSoFar: number;
  status: 'Active' | 'Inactive' | 'Pending';
}

interface StartSessionPayload {
  plateNumber: string;
  vehicleType: string;
}

interface ParkingState {
  activeSession: ParkingSession | null;
  sessionHistory: ParkingSession[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ParkingState = {
  activeSession: null,
  sessionHistory: [],
  isLoading: false,
  error: null,
};

export const startSession = createAsyncThunk(
  'parking/startSession',
  async (payload: StartSessionPayload, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        return rejectWithValue('No access token found');
      }

      const headers = {
        Authorization: `Bearer ${accessToken}`
      };

      const response = await axios.post(
        `${BaseUrl}/parking/start-session/plate`,
        payload,
        { headers }
      );

      console.log('response', response.data);
      return response.data;    } catch (error: any) {
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

      const headers = {
        Authorization: `Bearer ${accessToken}`
      };

      const response = await axios.get(
        `${BaseUrl}/api/v1/parking/session/${sessionId}`,
        { headers }
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch session details');
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
      const headers = {
        Authorization: `Bearer ${accessToken}`
      };
      const response = await axios.get(`${BaseUrl}/parking/history`, { headers }); 
      console.log('Session History Response:', response.data);
      return response.data;
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
        // Potentially update feeSoFar here too based on duration
      }
    },
    clearActiveSession: (state) => {
        state.activeSession = null;
    }
    // Add reducers for starting, ending sessions, fetching history
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
      .addCase(fetchSessionHistory.fulfilled, (state, action: PayloadAction<ParkingSession[]>) => {
        state.isLoading = false;
        state.sessionHistory = action.payload;
      })
      .addCase(fetchSessionHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to fetch session history';
      });
  },
});

export const { updateLiveDuration, clearActiveSession } = parkingSlice.actions;
export default parkingSlice.reducer;