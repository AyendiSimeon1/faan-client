import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { BaseUrl } from '../../../config';
import { logSuccess, logError } from '@/utils/logger';

interface CarDetails {
  plateNumber: string;
  type: string;
  // Add other car details that your API returns
}

interface CarState {
  isLoading: boolean;
  error: string | null;
  carDetails: CarDetails | null;
}

const initialState: CarState = {
  isLoading: false,
  error: null,
  carDetails: null,
};

export const processCarImage = createAsyncThunk(
  'car/processImage',
  async (imageData: FormData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      const response = await axios.post(`${BaseUrl}/parking/process-image`, imageData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
      });
      console.log('Image processing response:', response.data);
      
      logSuccess({
        feature: 'Car',
        action: 'Image Processing Success',
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Image processing error:', error);
      logError({
        feature: 'Car',
        action: 'Image Processing Failed',
        error,
      });
      return rejectWithValue(error.message);
    }
  }
);

const carSlice = createSlice({
  name: 'car',
  initialState,
  reducers: {
    clearCarDetails: (state) => {
      state.carDetails = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(processCarImage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(processCarImage.fulfilled, (state, action: PayloadAction<CarDetails>) => {
        state.isLoading = false;
        state.carDetails = action.payload;
        state.error = null;
      })
      .addCase(processCarImage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCarDetails } = carSlice.actions;
export default carSlice.reducer;
