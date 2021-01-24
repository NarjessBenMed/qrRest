import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const addTable = createAsyncThunk(
  'table/add-table',
  async (FormData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/table/create-table', FormData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const getTables = createAsyncThunk(
  'table/get-tables',
  async (id, { rejectWithValue }) => {
    try {
      console.log('id rest', id);
      const response = await axios.get(`/table/my-tables/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const deleteTable = createAsyncThunk(
  'table/del-table',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/table/del-table/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const tableSlice = createSlice({
  name: 'table',
  initialState: {
    status: 'idle',
    errors: null,
    table: null,
    listTable: null,
  },
  reducers: {},
  extraReducers: {
    [addTable.pending]: (state, action) => {
      state.status = 'loading';
    },
    [addTable.fulfilled]: (state, action) => {
      return {
        ...state,
        status: 'succeded',
        table: action.payload,
        errors: null,
      };
    },
    [addTable.rejected]: (state, action) => ({
      ...state,
      status: 'failed',
      errors: action.payload,
    }),
    [getTables.pending]: (state, action) => {
      state.status = 'loading';
    },
    [getTables.fulfilled]: (state, action) => {
      return {
        ...state,
        status: 'succeded',
        listTable: action.payload,
        errors: null,
      };
    },
    [getTables.rejected]: (state, action) => ({
      ...state,
      status: 'failed',
      errors: action.payload,
    }),
    [deleteTable.pending]: (state, action) => {
      state.status = 'loading';
    },
    [deleteTable.fulfilled]: (state, action) => {
      return {
        ...state,
        status: 'succeded',
        errors: null,
      };
    },
    [deleteTable.rejected]: (state, action) => ({
      ...state,
      status: 'failed',
      errors: action.payload,
    }),
  },
});
export default tableSlice.reducer;
