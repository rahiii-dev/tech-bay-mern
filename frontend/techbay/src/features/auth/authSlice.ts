import { createSlice } from '@reduxjs/toolkit';
import { User } from './authTypes';

export interface AuthState {
  user: User | null;
}

const initialState: AuthState = {
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) as User : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredential: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('user');
    },
  }
});

export const { logout, setCredential } = authSlice.actions;
export default authSlice.reducer;
