import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const API_URL = process.env.NEXT_PUBLIC_BASE_API_URL; // Адреса вашого бекенду

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    await axios.post(`${API_URL}/users/login/`, credentials, {withCredentials: true});
    return true;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});


export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/users/register/`, userData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});




const initialState = {
  isLoading: false,
  error: null,
  successMessage: null,
  isAuthenticated: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = 'Registration successful! Please log in.';
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Registration failed.';
      });
  },
});


export const { logout , updateToken} = authSlice.actions;
export default authSlice.reducer;
