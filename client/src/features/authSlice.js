import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const authClient = createAsyncThunk(
  'auth/auth-client',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post('/auth/auth-client', data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const response = await axios.post('/auth/login', data);
    if (response.data.role === 'admin') {
      data.history.push('/admin-section');
    } else if (response.data.role === 'owner') {
      data.history.push('/owner-section');
    } else if (response.data.role === 'worker') {
      data.history.push('/worker-section');
    } else {
      data.history.push('/');
    }
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    isClient: false,
    status: 'idle',
    user: null,
    errors: null,
  },
  reducers: {
    clearClient(state) {
      return { ...state, isClient: false };
    },
    logout(state) {
      localStorage.removeItem('token');
      return { ...state, token: null, isAuthenticated: false, user: null };
    },
    initState(state) {
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        isClient: false,
        status: 'idle',
        user: null,
        errors: null,
      };
    },
  },
  extraReducers: {
    [login.pending]: (state, action) => {
      state.status = 'loading';
    },
    [login.fulfilled]: (state, action) => {
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        status: 'succeeded',
        isAuthenticated: true,
        user: action.payload,
        errors: null,
      };
    },
    [login.rejected]: (state, action) => ({
      ...state,
      status: 'failed',
      errors: action.payload,
    }),
    [authClient.pending]: (state, action) => {
      state.status = 'loading';
    },
    [authClient.fulfilled]: (state, action) => {
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        status: 'succeeded',
        isClient: true,
        errors: null,
      };
    },
    [authClient.rejected]: (state, action) => ({
      ...state,
      status: 'failed',
      errors: action.payload,
    }),
  },
});

export const { logout, initState, clearClient } = authSlice.actions;
export default authSlice.reducer;
