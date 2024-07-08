import { createSlice } from "@reduxjs/toolkit";
import { CategoryResponse } from "../../pages/Admin/Category";
import { Product } from "../product/productTypes";
import { BACKEND_ERROR_RESPONSE } from "../../utils/types";
import { filterProductsUsingCategory, loadShopPage } from "./shopThunk";

export interface shopState {
    categories : CategoryResponse[];
    products: Product[];
    activeCategory: string,
    status: "idle" | "loading" | "sucesess" | "error",
    error: BACKEND_ERROR_RESPONSE | null;
}

const initialState: shopState = {
    categories: [],
    products: [],
    activeCategory: "all",
    status: "idle",
    error: null,
};

const shopSlice = createSlice({
    name: "shop",
    initialState,
    reducers: {
        setActiveCategory: (state, action) => {
            state.activeCategory = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(loadShopPage.pending, (state) => {
            state.status = "loading";
        })
        .addCase(loadShopPage.fulfilled, (state, action) => {
            state.status = "sucesess";
            state.products = action.payload.products;
            state.categories = action.payload.categories;
        })
        .addCase(loadShopPage.rejected, (state, action) => {
            state.status = "error";
            state.error = action.error
        })
        .addCase(filterProductsUsingCategory.pending, (state) => {
            state.status = "loading";
        })
        .addCase(filterProductsUsingCategory.fulfilled, (state, action) => {
            state.status = "sucesess";
            state.products = action.payload.products;
        })
        .addCase(filterProductsUsingCategory.rejected, (state, action) => {
            state.status = "error";
            state.error = action.error
        })
    }
})

export const { setActiveCategory } = shopSlice.actions;

export default shopSlice.reducer;