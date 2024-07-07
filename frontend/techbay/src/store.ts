import { configureStore } from '@reduxjs/toolkit';
import authReducer, { AuthState } from './features/auth/authSlice';
import productReducer, { ProductState } from './features/product/productSlice';
import homeReducer, { HomeState } from './features/home/homeSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productReducer,
        home: homeReducer,
    },
});

export type RootState = {
    auth: AuthState;
    products: ProductState;
    home: HomeState
};

export type AppDispatch = typeof store.dispatch;

export default store;
