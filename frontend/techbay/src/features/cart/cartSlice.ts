import { createSlice } from "@reduxjs/toolkit";
import { BACKEND_ERROR_RESPONSE } from "../../utils/types/backendResponseTypes";
import { Cart } from "../../utils/types/cartTypes";
import { addItemToCart, loadCart, removeItemFromCart, updateItemQuantity, verifyCartItems } from "./cartThunk";

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
    reducers: {
        clearCartError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(loadCart.pending, (state) => {
            state.status = "loading";
            state.error = null;
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
            state.error = null;
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
        .addCase(updateItemQuantity.pending, (state) => {
            state.status = "loading";
            state.error = null;
        })
        .addCase(updateItemQuantity.fulfilled, (state, action) => {
            state.status = "success";
            if(action.payload){
                state.cart = action.payload;
            }
        })
        .addCase(updateItemQuantity.rejected, (state, action) => {
            state.status = "error";
            state.error = action.payload ? action.payload : null;
        })
        .addCase(removeItemFromCart.pending, (state) => {
            state.status = "loading";
            state.error = null
        })
        .addCase(removeItemFromCart.fulfilled, (state, action) => {
            state.status = "success";
            if(action.payload){
                state.cart = action.payload;
            }
        })
        .addCase(removeItemFromCart.rejected, (state, action) => {
            state.status = "error";
            state.error = action.payload ? action.payload : null;
        })
        .addCase(verifyCartItems.pending, (state) => {
            state.error = null
        })
        .addCase(verifyCartItems.rejected, (state, action) => {
            state.status = "error";
            state.error = action.payload ? action.payload : null;
        })

    }
});

export const { clearCartError } = cartSlice.actions;

export default cartSlice.reducer