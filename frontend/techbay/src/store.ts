import { configureStore } from '@reduxjs/toolkit';
import authReducer, { AuthState } from './features/auth/authSlice';
import homeReducer, { HomeState } from './features/home/homeSlice';
import cartReducer, { CartState } from './features/cart/cartSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        home: homeReducer,
        cart: cartReducer,
    },
});

export type RootState = {
    auth: AuthState;
    home: HomeState;
    cart: CartState;
};

export type AppDispatch = typeof store.dispatch;

export default store;
