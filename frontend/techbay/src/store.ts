import { configureStore } from '@reduxjs/toolkit';
import authReducer, { AuthState } from './features/auth/authSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
    },
});

export type RootState = {
    auth: AuthState;
};
export type AppDispatch = typeof store.dispatch;

export default store;
