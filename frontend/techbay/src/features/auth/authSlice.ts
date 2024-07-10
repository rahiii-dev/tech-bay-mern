import { createSlice } from '@reduxjs/toolkit';
import { User } from './authTypes';
import { toast } from '../../components/ui/use-toast';
import { logoutAsync } from './authThunk';

export interface AuthState {
  user: User | null;
  status: "idle" | "success";
}

const initialState: AuthState = {
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) as User : null,
  status: "idle"
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredential: (state, action) => {
      state.user = action.payload;
      state.status = "success";
      localStorage.setItem('user', JSON.stringify(state.user));
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(logoutAsync.fulfilled, (state) => {
        state.user = null;
        localStorage.removeItem('user');
      })
      .addCase(logoutAsync.rejected, (_, action) => {
        console.error('Logout failed: ', action.payload);
        toast({
          variant: "destructive",
          title: 'Failed to Logout',
          description: 'Please try again',
          className: 'w-auto py-6 px-12 fixed bottom-2 right-2'
        });
      });
  },
});

export const { setCredential } = authSlice.actions;
export default authSlice.reducer;
