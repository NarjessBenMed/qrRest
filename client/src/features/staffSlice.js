import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const createWorker = createAsyncThunk(
  'staff/create-worker',
  async (data, { rejectWithValue }) => {
    console.log(data);
    try {
      const response = await axios.post('/worker/create-worker', data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const getAllWorkers = createAsyncThunk(
  'staff/get-all',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.get('/worker/workers');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const deleteWorker = createAsyncThunk(
  'staff/delete-worker',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.put('/worker/del-worker', data);

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const staffSlice = createSlice({
  name: 'staff',
  initialState: {
    status: 'idle',
    worker: '',
    workers: null,
    errors: null,
  },
  reducers: {},
  extraReducers: {
    [createWorker.pending]: (state, action) => {
      state.status = 'loading';
    },
    [createWorker.fulfilled]: (state, action) => {
      return {
        ...state,
        status: 'succeded',
        worker: action.payload,
      };
    },
    [createWorker.rejected]: (state, action) => ({
      ...state,
      status: 'failed',
      errors: action.payload,
    }),
    [getAllWorkers.pending]: (state, action) => {
      state.listStatus = 'loading';
    },
    [getAllWorkers.fulfilled]: (state, action) => {
      return {
        ...state,
        status: 'succeded',
        workers: action.payload,
      };
    },
    [getAllWorkers.rejected]: (state, action) => ({
      ...state,
      status: 'failed',
      errors: action.payload,
    }),
    [deleteWorker.pending]: (state, action) => {
      state.listStatus = 'loading';
    },
    [deleteWorker.fulfilled]: (state, action) => {
      return {
        ...state,
        listStatus: 'succeded',
        worker: action.payload,
      };
    },
    [deleteWorker.rejected]: (state, action) => ({
      ...state,
      listStatus: 'failed',
      errors: action.payload,
    }),
  },
});

export default staffSlice.reducer;
