// app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../store/slice/auth'
import uiReducer from '../store/slice/ui'
import parkingReducer from '../store/slice/parking';
import carReducer from '../store/slice/car';
// Import other reducers (payment, wallet) here when created

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    parking: parkingReducer,
    car: carReducer,
    // payment: paymentReducer,
    // wallet: walletReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;