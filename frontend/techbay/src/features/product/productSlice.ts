import { createSlice } from "@reduxjs/toolkit";
import { BACKEND_ERROR_RESPONSE } from "../../utils/types/backendResponseTypes";
import { Product } from "./productTypes";
import { deleteProduct, getProductsList, restoreProduct } from "./productThunk";

export interface ProductState {
    products: Product[];
    status: "idle" | "loading" | "success" | "error";
    error: BACKEND_ERROR_RESPONSE | null;
}

const initialState: ProductState = {
    products: [],
    status: 'idle',
    error: null
}
const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setProducts: (state, action) => {
            state.products = action.payload;
            state.status = "success"
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProductsList.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(getProductsList.fulfilled, (state, action) => {
                state.products = action.payload.products;
                state.status = "success";
            })
            .addCase(getProductsList.rejected, (state, action) => {
                state.status = "error";
                state.error = action.payload || null;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.products = state.products?.map((product) =>
                    product._id === action.payload ? { ...product, isActive: false } : product
                ) || null;
                state.status = "success";
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.status = "error";
                state.error = action.payload || null;
            })
            .addCase(restoreProduct.fulfilled, (state, action) => {
                state.products = state.products?.map((product) =>
                    product._id === action.payload ? { ...product, isActive: true } : product
                ) || null;
                state.status = "success";
            })
            .addCase(restoreProduct.rejected, (state, action) => {
                state.status = "error";
                state.error = action.payload || null;
            });
    }
})

export const { setProducts } = productSlice.actions;
export default productSlice.reducer;