import { createSlice } from "@reduxjs/toolkit";
import { Product } from "../product/productTypes";
import { BACKEND_ERROR_RESPONSE } from "../../utils/types";
import { loadPage } from "./homeThunk";

export interface HomeState {
    new_products: Product[],
    top_products: Product[],
    status: "idle" | "loading" | "success" | "error",
    error: BACKEND_ERROR_RESPONSE | null;
}

const initialState: HomeState = {
    new_products: [],
    top_products: [],
    status: 'idle',
    error: null
};

const homeSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadPage.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loadPage.fulfilled, (state, action) => {
                state.new_products = action.payload.newest_products;
                state.top_products = action.payload.top_products;
                state.status = 'success';
                state.error = null;
            })
            .addCase(loadPage.rejected, (state, action) => {
                state.status = 'error';
                state.error = action.payload as BACKEND_ERROR_RESPONSE;
            });
    }
})

export default homeSlice.reducer;