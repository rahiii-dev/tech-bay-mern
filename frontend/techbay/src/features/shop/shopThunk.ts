import { createAsyncThunk } from "@reduxjs/toolkit";
import { BACKEND_ERROR_RESPONSE } from "../../utils/types";
import axios from "../../utils/axios";
import { USER_CATEGORY_LIST_URL, USER_PRODUCT_LIST_URL } from "../../utils/urls/userUrls";
import { ShopPageResponse } from "./shopTypes";
import { ProductList } from "../product/productTypes";
import { CategoryListResponse } from "../../pages/Admin/Category";

export const loadShopPage = createAsyncThunk<ShopPageResponse, void, { rejectValue: BACKEND_ERROR_RESPONSE }>(
    'shop/loadShopPage',
    async (_, { rejectWithValue }) => {
        try {
            const productResponse = await axios.get<ProductList>(USER_PRODUCT_LIST_URL);
            const categoriesResponse = await axios.get<CategoryListResponse>(USER_CATEGORY_LIST_URL);
            

            return {
                categories: categoriesResponse.data.categories,
                products: productResponse.data.products,
            }
            
        } catch (error: any) {
            return rejectWithValue(error.response.data as BACKEND_ERROR_RESPONSE);
        }
    }
);

export const filterProductsUsingCategory = createAsyncThunk<ProductList, string, { rejectValue: BACKEND_ERROR_RESPONSE }>(
    'shop/filterProductsUsingCategory',
    async (category, {rejectWithValue}) => {
        try {
            let productResponse;
            if(category === "all"){
                productResponse = await axios.get<ProductList>(USER_PRODUCT_LIST_URL);
            }
            else {
                productResponse = await axios.get<ProductList>(`${USER_PRODUCT_LIST_URL}?category=${category}`);
            }

            return productResponse.data
            
        } catch (error: any) {
            return rejectWithValue(error.response.data as BACKEND_ERROR_RESPONSE);
        }
    }
)