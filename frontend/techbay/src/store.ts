import { configureStore } from '@reduxjs/toolkit';
import authReducer, { AuthState } from './features/auth/authSlice';
import productReducer, { ProductState } from './features/product/productSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productReducer,
    },
});

export type RootState = {
    auth: AuthState;
    products: ProductState
};

export type AppDispatch = typeof store.dispatch;

export default store;
