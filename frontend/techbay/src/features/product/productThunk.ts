import { createAsyncThunk } from "@reduxjs/toolkit";
import { BACKEND_ERROR_RESPONSE, BACKEND_RESPONSE } from "../../utils/types";
import axios from "../../utils/axios";
import { PRODUCT_DELETE_URL, PRODUCT_LIST_URL, PRODUCT_RESTORE_URL } from "../../utils/urls/adminUrls";
import { Product, ProductList } from "./productTypes";
import { toast } from "../../components/ui/use-toast";

type AsyncThunkConfig = {
    rejectValue: BACKEND_ERROR_RESPONSE;
};

export const getProductsList = createAsyncThunk<ProductList, void, AsyncThunkConfig>(
    'products/getProductsList',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get<BACKEND_RESPONSE<ProductList>>(PRODUCT_LIST_URL);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data as BACKEND_ERROR_RESPONSE);
        }
    }
);

export const deleteProduct = createAsyncThunk<string, string, AsyncThunkConfig>(
    'products/deleteProduct',
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete<BACKEND_RESPONSE<void>>(PRODUCT_DELETE_URL(id));
            toast({
                variant: "default",
                title: `Product Deleted Successfully.`,
                description: "",
                className: "bg-green-500 text-white rounded w-max shadow-lg fixed right-3 bottom-3",
            });
            return id
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Failed to Delete product",
                className: 'w-auto py-6 px-12 fixed bottom-2 right-2'
            })
            return rejectWithValue(error.response.data as BACKEND_ERROR_RESPONSE);
        }
    }
);

export const restoreProduct = createAsyncThunk<string, string, AsyncThunkConfig>(
    'products/restoreProduct',
    async (id, { rejectWithValue }) => {
        try {
            await axios.put<BACKEND_RESPONSE<Product>>(PRODUCT_RESTORE_URL(id));
            toast({
                variant: "default",
                title: `Product Restored Successfully.`,
                description: "",
                className: "bg-green-500 text-white rounded w-max shadow-lg fixed right-3 bottom-3",
            });
            return id;
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Failed to Restore product",
                className: 'w-auto py-6 px-12 fixed bottom-2 right-2'
            })
            return rejectWithValue(error.response.data as BACKEND_ERROR_RESPONSE);
        }
    }
);
