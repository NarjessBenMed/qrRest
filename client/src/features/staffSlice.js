import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const createWorker = createAsyncThunk(
  'staff/create-worker',
  async (data, { rejectWithValue }) => {
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
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/worker/workers/${id}`);
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
    worker: '',
    workers: null,
    workerStatus: { create: 'idle', delete: 'idle', getAll: 'idle' },
    workerErrors: { create: 'null', delete: 'null', getAll: 'null' },
  },
  reducers: {},
  extraReducers: {
    [createWorker.pending]: (state, action) => {
      return {
        ...state,
        workerStatus: { ...state.workerStatus, create: 'loading' },
      };
    },
    [createWorker.fulfilled]: (state, action) => {
      return {
        ...state,
        worker: action.payload,
        workerStatus: { ...state.workerStatus, create: 'succeded' },
        workerErrors: { ...state.workerErrors, create: 'null' },
      };
    },
    [createWorker.rejected]: (state, action) => {
      return {
        ...state,
        workerStatus: { ...state.workerStatus, create: 'failed' },
        workerErrors: { ...state.workerErrors, create: action.payload },
      };
    },
    [getAllWorkers.pending]: (state, action) => {
      return {
        ...state,
        workerStatus: { ...state.workerStatus, getAll: 'loading' },
      };
    },
    [getAllWorkers.fulfilled]: (state, action) => {
      return {
        ...state,
        workers: action.payload,
        workerStatus: { ...state.workerStatus, getAll: 'succeded' },
        workerErrors: { ...state.workerErrors, getAll: 'null' },
      };
    },
    [getAllWorkers.rejected]: (state, action) => {
      return {
        ...state,
        workerStatus: { ...state.workerStatus, getAll: 'failed' },
        workerErrors: { ...state.workerErrors, getAll: action.payload },
      };
    },
    [deleteWorker.pending]: (state, action) => {
      return {
        ...state,
        workerStatus: { ...state.workerStatus, delete: 'loading' },
      };
    },
    [deleteWorker.fulfilled]: (state, action) => {
      return {
        ...state,
        worker: action.payload,
        workerStatus: { ...state.workerStatus, delete: 'succeded' },
        workerErrors: { ...state.workerErrors, delete: 'null' },
      };
    },
    [deleteWorker.rejected]: (state, action) => {
      return {
        ...state,
        workerStatus: { ...state.workerStatus, delete: 'failed' },
        workerErrors: { ...state.workerErrors, delete: action.payload },
      };
    },
  },
});

export default staffSlice.reducer;
