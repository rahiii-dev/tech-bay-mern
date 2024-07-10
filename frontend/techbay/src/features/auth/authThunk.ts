import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';
import { LOGOUT_URL } from '../../utils/urls/authUrls';
import { BACKEND_ERROR_RESPONSE } from '../../utils/types/backendResponseTypes';
import { AxiosError } from 'axios';

type AsyncThunkConfig = {
    rejectValue: BACKEND_ERROR_RESPONSE;
};

export const logoutAsync = createAsyncThunk<null, void, AsyncThunkConfig>(
    'auth/logout',
    async (_, { rejectWithValue }) => {
      try {
        await axios.post(LOGOUT_URL);
        return null;
      } catch (err) {
        const error = err as AxiosError<BACKEND_ERROR_RESPONSE>;
        if (error.response) {
          return rejectWithValue(error.response.data);
        } else {
          return rejectWithValue({
            message: 'An unexpected error occurred'
          } as BACKEND_ERROR_RESPONSE);
        }
      }
    }
  );