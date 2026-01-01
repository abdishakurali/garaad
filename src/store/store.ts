import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import authReducer from "./features/authSlice";
import learningReducer from "./features/learningSlice";
import communityReducer from "./features/communitySlice";

// Configure persistence for auth reducer
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "accessToken", "refreshToken", "isAuthenticated"], // Only persist these fields
};

// Combine reducers
const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  learning: learningReducer,
  community: communityReducer,
});

// Create the store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "community/createPost/pending",
          "community/createPost/fulfilled"
        ],
        // Allow File objects in these paths
        ignoredActionPaths: ['payload.images', 'meta.arg.images'],
        ignoredPaths: ['community.posts.images'],
      },
    }),
});

// Create the persistor
export const persistor = persistStore(store);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
