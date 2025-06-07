import axios from 'axios';
import { BaseUrl } from '../../../config';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { logSuccess, logError } from '@/utils/logger';

// Define types for user and state
interface User {
  id: string;
  name: string;
  email: string;
  plateNumber?: string;
  // ... other user properties
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  guestDetails: { name?: string, plateNumber?: string, email?: string, phoneNumber?: string } | null;
  emailVerification: {
    isVerified: boolean;
    verificationSent: boolean;
    email: null;
  };
  passwordReset: {
    token: string | null;
    isValid: boolean;
  };
}

const initialState: AuthState = {
  user: null,
  token: null, // In a real app, you might try to load this from localStorage
  isAuthenticated: false,
  isLoading: false,
  error: null,
  guestDetails: null,
  emailVerification: {
    isVerified: false,
    verificationSent: false,
    email: null,
  },
  passwordReset: {
    token: null,
    isValid: false
  }
};

interface LoginResponse {
  accessToken: any;
  user: User;
  token: string;
}

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { email: string, password_field: string }, { rejectWithValue }) => {
    try {
      console.log('Login Credentials:', credentials);
      const response = await axios.post<LoginResponse>(`${BaseUrl}/auth/login`, credentials);

      logSuccess({ 
        feature: 'Auth', 
        action: 'Login Success', 
        data: { email: credentials.email } 
      });
      console.log('Response Data:', response.data);
      const token = response.data.data.accessToken;
      console.log('Access Token:', token);
      
      localStorage.setItem('accessToken', response.data.data.accessToken);
      
      return response.data;
      

    } catch (error: any) {
      console.log('Login Error:', error);
      logError({ 
        feature: 'Auth', 
        action: 'Login Failed', 
        error 
      });
      return rejectWithValue(error.message);
    }
  }
);

export const signupUser = createAsyncThunk(
    'auth/signupUser',
    async (userData: { email: string, password_field: string, name: string }, { dispatch, rejectWithValue }) => {
        try {
            console.log('User Data:', userData);
            const response = await axios.post<LoginResponse>(`${BaseUrl}/auth/register`, userData);
            logSuccess({ 
                feature: 'Auth', 
                action: 'Signup Success', 
                data: { email: userData.email } 
            });
            console.log('Response Data:', response.data);
            
            // Set email for verification and send verification email
            dispatch(authSlice.actions.setEmailForVerification(userData.email));
            dispatch(sendVerificationEmail(userData.email));
            
            return response.data;
        } catch (error: any) {
            console.log('i am the error', error);
            logError({ 
                feature: 'Auth', 
                action: 'Signup Failed', 
                error 
            });
            return rejectWithValue(error.message);
        }
    }
);

export const sendVerificationEmail = createAsyncThunk(
  'auth/sendVerificationEmail',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axios.post<{ message: string }>(`${BaseUrl}/auth/send-verification`, { email });
      logSuccess({ 
        feature: 'Auth', 
        action: 'Verification Email Sent', 
        data: { email } 
      });
      return response.data;
    } catch (error: any) {
      logError({ 
        feature: 'Auth', 
        action: 'Verification Email Failed', 
        error 
      });
      return rejectWithValue(error.message);
    }
  }
);

export const verifyEmailOtp = createAsyncThunk(
  'auth/verifyEmailOtp',
  async ({ email, otp }: { email: string; otp: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post<{ message: string }>(`${BaseUrl}/auth/verify-email`, { 
      identifier: email, 
      otpCode: otp 
      });
      logSuccess({ 
      feature: 'Auth', 
      action: 'Email Verified', 
      data: { email } 
      });
      console.log('Email Verification Response:', response.data);
      return response.data;
    } catch (error: any) {
      logError({ 
      feature: 'Auth', 
      action: 'Email Verification Failed', 
      error 
      });
      console.log('Email Verification Error:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (credentials: { email: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BaseUrl}/auth/forgot-password`,
        credentials
      );
      logSuccess({ 
        feature: 'Auth', 
        action: 'Forgot Password Success', 
        data: { email: credentials.email } 
      });
      return response.data;
    } catch (error: any) {
      logError({ 
        feature: 'Auth', 
        action: 'Forgot Password Failed', 
        error 
      });
      return rejectWithValue(error.message);
    }
  }
);

// export const validateResetToken = createAsyncThunk(
//   'auth/validateResetToken',
//   async (token: string, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(`${BaseUrl}/auth/reset-password/${token}`);
//       logSuccess({ 
//         feature: 'Auth', 
//         action: 'Reset Token Validated', 
//       });
//       return token;
//     } catch (error: any) {
//       logError({ 
//         feature: 'Auth', 
//         action: 'Reset Token Validation Failed', 
//         error 
//       });
//       return rejectWithValue(error.message);
//     }
//   }
// );

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',  async ({ token, newPassword }: { token: string; newPassword: string }, { rejectWithValue }) => {
    console.log('Reset Password Token:', token);
    try {      
      const response = await axios.patch(`${BaseUrl}/auth/reset-password/${token}`, { 
        newPassword_field: newPassword 
      });
      console.log('Reset Password Response:', response.data);
      logSuccess({ 
        feature: 'Auth', 
        action: 'Password Reset Success' 
      });
      return response.data;
    } catch (error: any) {
      console.log('the error', error)
      logError({ 
        feature: 'Auth', 
        action: 'Password Reset Failed', 
        error 
      });
      return rejectWithValue(error.message);
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      logSuccess({ 
        feature: 'Auth', 
        action: 'Logout Success' 
      });
    },
    setGuestDetails: (state, action: PayloadAction<AuthState['guestDetails']>) => {
      state.guestDetails = action.payload;
      logSuccess({ 
        feature: 'Auth', 
        action: 'Guest Details Updated', 
        data: action.payload 
      });
    },
    clearGuestDetails: (state) => {
      state.guestDetails = null;
      logSuccess({ 
        feature: 'Auth', 
        action: 'Guest Details Cleared' 
      });
    },
    setEmailForVerification: (state, action: PayloadAction<string>) => {
      state.emailVerification.email = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        logSuccess({ 
          feature: 'Auth', 
          action: 'Login State Updated', 
          // data: { userId: action.payload.user.id } 
        });
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        logError({ 
          feature: 'Auth', 
          action: 'Login State Error', 
          error: action.payload 
        });
      })
             .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
    })
    .addCase(signupUser.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        logSuccess({ 
            feature: 'Auth', 
            action: 'Signup State Updated', 
            data: { userId: action.payload.user.id } 
        });
    })
  .addCase(signupUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      logError({ 
          feature: 'Auth', 
          action: 'Signup State Error', 
          error: action.payload 
      })
  })
  .addCase(forgotPassword.pending, (state) => {
    state.isLoading = true;
    state.error = null;
  })
  .addCase(forgotPassword.fulfilled, (state) => {
    state.isLoading = false;
    state.error = null;
  })
  .addCase(forgotPassword.rejected, (state, action) => {
    state.isLoading = false;
    state.error = action.payload as string;
  })
  .addCase(sendVerificationEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendVerificationEmail.fulfilled, (state) => {
        state.isLoading = false;
        state.emailVerification.verificationSent = true;
        state.error = null;
      })
      .addCase(sendVerificationEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(verifyEmailOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyEmailOtp.fulfilled, (state) => {
        state.isLoading = false;
        state.emailVerification.isVerified = true;
        state.error = null;
      })
      .addCase(verifyEmailOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // .addCase(validateResetToken.pending, (state) => {
      //   state.isLoading = true;
      //   state.error = null;
      // })
      // .addCase(validateResetToken.fulfilled, (state, action) => {
      //   state.isLoading = false;
      //   state.passwordReset.token = action.payload;
      //   state.passwordReset.isValid = true;
      //   state.error = null;
      // })
      // .addCase(validateResetToken.rejected, (state, action) => {
      //   state.isLoading = false;
      //   state.passwordReset.isValid = false;
      //   state.error = action.payload as string;
      // })
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.passwordReset.token = null;
        state.passwordReset.isValid = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});


export const { logout, setGuestDetails, clearGuestDetails } = authSlice.actions;
export default authSlice.reducer;