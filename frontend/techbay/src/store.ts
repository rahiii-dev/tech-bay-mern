import { configureStore } from '@reduxjs/toolkit';
import authReducer, { AuthState } from './features/auth/authSlice';
import productReducer, { ProductState } from './features/product/productSlice';
import homeReducer, { HomeState } from './features/home/homeSlice';
import shopReducer, { shopState } from './features/shop/shopSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productReducer,
        home: homeReducer,
        shop: shopReducer,
    },
});

export type RootState = {
    auth: AuthState;
    products: ProductState;
    home: HomeState;
    shop: shopState
};

export type AppDispatch = typeof store.dispatch;

export default store;
