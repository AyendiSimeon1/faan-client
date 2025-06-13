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
// import { persistStore, persistReducer } from 'redux-persist'; // Removed
// import storage from 'redux-persist/lib/storage'; // localStorage // Removed
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../store/slice/auth';
import uiReducer from '../store/slice/ui';
import parkingReducer from '../store/slice/parking';
import carReducer from '../store/slice/car';

// Persist configuration - Removed
// const persistConfig = {
//   key: 'root',
//   storage,
//   whitelist: ['auth', 'parking', 'car'],
//   // blacklist: ['ui'],
// };

// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  parking: parkingReducer,
  car: carReducer,
});

// Create persisted reducer - Changed to direct rootReducer
// const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: rootReducer, // Directly use rootReducer
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // serializableCheck: { // Removed, as it's related to redux-persist
      //   ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      // },
    }),
});

// export const persistor = persistStore(store); // Removed

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
