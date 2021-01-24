import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const createOwner = createAsyncThunk(
  'owner/create-owner',
  async (data, { rejectWithValue }) => {
    console.log(data);
    try {
      const response = await axios.post('/owner/create-owner', data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const getAllOwners = createAsyncThunk(
  'owner/get-all',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.get('/owner/owners');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const deleteOwner = createAsyncThunk(
  'owner/delete-owner',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.put('/owner/del-owner', data);

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const adminSlice = createSlice({
  name: 'owner',
  initialState: {
    status: 'idle',
    listStatus: 'idle',
    owner: '',
    owners: null,
    errors: null,
  },
  reducers: {
    initErrors(state) {
      return { ...state, errors: null };
    },
  },
  extraReducers: {
    [createOwner.pending]: (state, action) => {
      state.status = 'loading';
    },
    [createOwner.fulfilled]: (state, action) => {
      return {
        ...state,
        status: 'succeded',
        errors: null,
        owner: action.payload,
      };
    },
    [createOwner.rejected]: (state, action) => ({
      ...state,
      status: 'failed',
      errors: action.payload,
    }),
    [getAllOwners.pending]: (state, action) => {
      state.listStatus = 'loading';
    },
    [getAllOwners.fulfilled]: (state, action) => {
      return {
        ...state,
        listStatus: 'succeded',
        owners: action.payload,
        errors: null,
      };
    },
    [getAllOwners.rejected]: (state, action) => ({
      ...state,
      listStatus: 'failed',
      errors: action.payload,
    }),
    [deleteOwner.pending]: (state, action) => {
      state.listStatus = 'loading';
    },
    [deleteOwner.fulfilled]: (state, action) => {
      return {
        ...state,
        listStatus: 'succeded',
        owner: action.payload,
        errors: null,
      };
    },
    [deleteOwner.rejected]: (state, action) => ({
      ...state,
      listStatus: 'failed',
      errors: action.payload,
    }),
  },
});
export const { initErrors } = adminSlice.actions;

export default adminSlice.reducer;
