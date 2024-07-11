import { createAsyncThunk } from "@reduxjs/toolkit";
import { Cart } from "../../utils/types/cartTypes";
import { BACKEND_ERROR_RESPONSE } from "../../utils/types/backendResponseTypes";
import axios from "../../utils/axios";
import { USER_ADD_TO_CART, USER_CART } from "../../utils/urls/userUrls";

export const loadCart = createAsyncThunk<Cart, void, { rejectValue: BACKEND_ERROR_RESPONSE }>(
    'cart/loadCart',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get<Cart>(USER_CART);
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
            const response = await axios.post<Cart>(USER_ADD_TO_CART, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data as BACKEND_ERROR_RESPONSE);
        }
    }
);