import { configureStore } from '@reduxjs/toolkit';
import authReducer, { AuthState } from './features/auth/authSlice';
import homeReducer, { HomeState } from './features/home/homeSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        home: homeReducer,
    },
});

export type RootState = {
    auth: AuthState;
    home: HomeState;
};

export type AppDispatch = typeof store.dispatch;

export default store;
