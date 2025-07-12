// // app/store.ts
// import { configureStore } from '@reduxjs/toolkit';
// import { persistStore, persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage'; // localStorage
// import { combineReducers } from '@reduxjs/toolkit';
// import authReducer from '../store/slice/auth';
// import uiReducer from '../store/slice/ui';
// import parkingReducer from '../store/slice/parking';
// import carReducer from '../store/slice/car';

// // Persist configuration
// const persistConfig = {
//   key: 'root',
//   storage,
//   whitelist: ['auth', 'parking', 'car'], // Only persist these reducers
//   // blacklist: ['ui'], // Don't persist UI state (optional)
// };

// // Combine all reducers
// const rootReducer = combineReducers({
//   auth: authReducer,
//   ui: uiReducer,
//   parking: parkingReducer,
//   car: carReducer,
// });

// // Create persisted reducer
// const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const store = configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
//       },
//     }),
// });

// export const persistor = persistStore(store);

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;



// app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import persistConfig from './persistConfig';
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../store/slice/auth';
import uiReducer from '../store/slice/ui';
import parkingReducer from '../store/slice/parking';
import carReducer from '../store/slice/car';
import paymentReducer from '../store/slice/payments'; // Added payments reducer
import walletReducer from '../store/slice/wallet'; // Added wallet reducer

// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  parking: parkingReducer,
  car: carReducer,
  payments: paymentReducer, // Added payments reducer
  wallet: walletReducer, // Added wallet reducer
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
