import { createSlice } from "@reduxjs/toolkit";
import { BACKEND_ERROR_RESPONSE } from "../../utils/types/backendResponseTypes";
import { Cart } from "../../utils/types/cartTypes";
import { addItemToCart, loadCart } from "./cartThunk";

export interface CartState {
    cart : Cart | null,
    status: "idle" | "loading" | "success" | "error",
    error: BACKEND_ERROR_RESPONSE | null 
}

const initialState: CartState = {
    cart : null,
    status: "idle",
    error: null
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(loadCart.pending, (state) => {
            state.status = "loading";
        })
        .addCase(loadCart.fulfilled, (state, action) => {
            state.status = "success";
            if(action.payload){
                state.cart = action.payload;
            }
        })
        .addCase(loadCart.rejected, (state, action) => {
            state.status = "error";
            state.error = action.payload ? action.payload : null;
        })
        .addCase(addItemToCart.pending, (state) => {
            state.status = "loading";
        })
        .addCase(addItemToCart.fulfilled, (state, action) => {
            state.status = "success";
            if(action.payload){
                state.cart = action.payload;
            }
        })
        .addCase(addItemToCart.rejected, (state, action) => {
            state.status = "error";
            state.error = action.payload ? action.payload : null;
        })

    }
});

export default cartSlice.reducer