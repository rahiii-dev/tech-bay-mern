import { createAsyncThunk } from "@reduxjs/toolkit";
import { BACKEND_ERROR_RESPONSE } from "../../utils/types";
import axios from "../../utils/axios";
import { HOME_PAGE_URL } from "../../utils/urls/userUrls";
import { HOME_PAGE_RESPONSE } from "./homeTypes";

export const loadPage = createAsyncThunk<HOME_PAGE_RESPONSE, void, { rejectValue: BACKEND_ERROR_RESPONSE }>(
    'home/loadPage',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get<HOME_PAGE_RESPONSE>(HOME_PAGE_URL);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data as BACKEND_ERROR_RESPONSE);
        }
    }
);