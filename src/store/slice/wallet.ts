import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { BaseUrl } from '../../../config';

export const topupWallet = createAsyncThunk(
  'wallet/topupWallet',
  async (amount: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Authentication token not found');
      const response = await axios.post(
        `${BaseUrl}/wallet/topup`,
        { amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Top-up successful:', response.data);
      return response.data;
    } catch (err: any) {
        console.log('the error', err);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchWalletBalance = createAsyncThunk(
  'wallet/fetchWalletBalance',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Authentication token not found');
      const response = await axios.get(
        `${BaseUrl}/wallet/balance`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

interface WalletState {
  isLoading: boolean;
  error: string | null;
  success: any | null;
  balance: number | null;
}

const initialState: WalletState = {
  isLoading: false,
  error: null,
  success: null,
  balance: null,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(topupWallet.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(topupWallet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = action.payload;
      })
      .addCase(topupWallet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchWalletBalance.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWalletBalance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.balance = typeof action.payload === 'number'
          ? action.payload
          : action.payload.balance;
      })
      .addCase(fetchWalletBalance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default walletSlice.reducer;
