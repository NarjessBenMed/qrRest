import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
export const createOwner = createAsyncThunk(
  "owner/create-owner",
  async (data, { rejectWithValue }) => {
    console.log(data);
    try {
      const response = await axios.post("/owner/create-owner", data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const getAllOwners = createAsyncThunk(
  "owner/get-all",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.get("/owner/owners");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const deleteOwner = createAsyncThunk(
  "owner/delete-owner",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.put("/owner/del-owner", data);

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const adminSlice = createSlice({
  name: "owner",
  initialState: {
    owner: "",

    owners: null,
    adminStatus: {
      create: "idle",
      delete: "idle",
      getAll: "idle",
    },
    adminErrors: {
      create: null,
      delete: null,

      getAll: null,
    },
  },
  reducers: {
    initErrors(state) {
      return {
        ...state,
        adminErrors: { create: null, delete: null, getAll: null },
      };
    },
  },
  extraReducers: {
    [createOwner.pending]: (state, action) => {
      return {
        ...state,
        adminStatus: { ...state.adminStatus, create: "loading" },
      };
    },
    [createOwner.fulfilled]: (state, action) => {
      return {
        ...state,
        adminStatus: { ...state.adminStatus, create: "succeded" },
        adminErrors: { ...state.adminErrors, create: null },
        owner: action.payload,
      };
    },
    [createOwner.rejected]: (state, action) => ({
      ...state,
      adminStatus: { ...state.adminStatus, create: "failed" },
      adminErrors: { ...state.adminErrors, create: action.payload },
    }),
    [getAllOwners.pending]: (state, action) => {
      return {
        ...state,
        adminStatus: { ...state.adminStatus, getAll: "loading" },
      };
    },
    [getAllOwners.fulfilled]: (state, action) => {
      return {
        ...state,
        owners: action.payload,
        adminStatus: { ...state.adminStatus, getAll: "succeded" },
        adminErrors: { ...state.adminErrors, getAll: null },
      };
    },
    [getAllOwners.rejected]: (state, action) => {
      return {
        ...state,
        adminStatus: { ...state.adminStatus, getAll: "failed" },
        adminErrors: { ...state.adminErrors, getAll: action.payload },
      };
    },
    [deleteOwner.pending]: (state, action) => {
      return {
        ...state,
        adminStatus: { ...state.adminStatus, delete: "loading" },
      };
    },
    [deleteOwner.fulfilled]: (state, action) => {
      return {
        ...state,
        owner: action.payload,
        adminStatus: { ...state.adminStatus, delete: "succeded" },
        adminErrors: { ...state.adminErrors, delete: null },
      };
    },
    [deleteOwner.rejected]: (state, action) => ({
      ...state,
      adminStatus: { ...state.adminStatus, delete: "failed" },
      adminErrors: { ...state.adminErrors, delete: action.payload },
    }),
  },
});
export const { initErrors } = adminSlice.actions;

export default adminSlice.reducer;
