import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';

// Import slices
import authReducer from './slices/authSlice';
import favouritesReducer from './slices/favouritesSlice';

// Redux Persist Configuration
const persistConfig = {
  key: 'root', // Key for AsyncStorage
  storage: AsyncStorage, // Use AsyncStorage for React Native
  whitelist: ['auth', 'favourites'], // Which reducers to persist
  // blacklist: [], // Which reducers NOT to persist (if needed)
};

// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  favourites: favouritesReducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions in serializable check
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// Create persistor for wrapping App component
export const persistor = persistStore(store);
