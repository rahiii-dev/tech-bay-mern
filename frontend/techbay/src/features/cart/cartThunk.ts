import { createAsyncThunk } from "@reduxjs/toolkit";
import { Cart } from "../../utils/types/cartTypes";
import { BACKEND_ERROR_RESPONSE } from "../../utils/types/backendResponseTypes";
import axios from "../../utils/axios";
import { USER_ADD_TO_CART_URL, USER_CART_URL, USER_CART_VERIFY, USER_DELETE_CART_ITEM_URL, USER_UPDATE_CART_ITEM_QUANTITY_URL, USER_WISH_TO_CART_URL } from "../../utils/urls/userUrls";

export const loadCart = createAsyncThunk<Cart, void, { rejectValue: BACKEND_ERROR_RESPONSE }>(
    'cart/loadCart',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get<Cart>(USER_CART_URL);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data as BACKEND_ERROR_RESPONSE);
        }
    }
);

export const addItemToCart = createAsyncThunk<Cart, {productId: string, quantity: number}, { rejectValue: BACKEND_ERROR_RESPONSE }>(
    'cart/addItemToCart',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.post<Cart>(USER_ADD_TO_CART_URL, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data as BACKEND_ERROR_RESPONSE);
        }
    }
);

export const updateItemQuantity = createAsyncThunk<Cart, {productId: string, action: 'increment' | 'decrement'}, { rejectValue: BACKEND_ERROR_RESPONSE }>(
    'cart/updateItemQuantity',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.put<Cart>(USER_UPDATE_CART_ITEM_QUANTITY_URL(data.productId), {action: data.action});
            return response.data
        } catch (error: any) {
            return rejectWithValue(error.response.data as BACKEND_ERROR_RESPONSE);
        }
    }
);

export const removeItemFromCart = createAsyncThunk<Cart, {productId: string}, { rejectValue: BACKEND_ERROR_RESPONSE }>(
    'cart/removeItemFromCart',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.delete<Cart>(USER_DELETE_CART_ITEM_URL(data.productId));
            return response.data
        } catch (error: any) {
            return rejectWithValue(error.response.data as BACKEND_ERROR_RESPONSE);
        }
    }
);

export const verifyCartItems = createAsyncThunk<null, void, { rejectValue: BACKEND_ERROR_RESPONSE }>(
    'cart/verifyCartItems',
    async (_, { rejectWithValue }) => {
        try {
            await axios.post<Cart>(USER_CART_VERIFY);
            return null
        } catch (error: any) {
            return rejectWithValue(error.response.data as BACKEND_ERROR_RESPONSE);
        }
    }
);

export const wishToCart = createAsyncThunk<Cart, void, { rejectValue: BACKEND_ERROR_RESPONSE }>(
    'cart/wishTOCart',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.post<Cart>(USER_WISH_TO_CART_URL);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data as BACKEND_ERROR_RESPONSE);
        }
    }
);