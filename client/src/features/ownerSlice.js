import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createRestaurant = createAsyncThunk(
  "restaurant/create-restaurant",
  async (formData, { rejectWithValue }) => {
    formData.forEach((value, key) => {
      console.log("key,value", key, value);
    });
    try {
      const response = await axios.post(
        "/restaurant/create-restaurant",
        formData
      );

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const deleteRestaurant = createAsyncThunk(
  "restaurant/delete-restaurant",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.put("/restaurant/del-rest", formData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const editRestaurant = createAsyncThunk(
  "restaurant/edit-restaurant",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.put("/restaurant/edit-rest", formData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getRestList = createAsyncThunk(
  "restaurant/getAll",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.get("/restaurant/my-rests");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const ownerSlice = createSlice({
  name: "restaurant",
  initialState: {
    restList: null,
    ownerStatus: {
      create: "idle",
      edit: "idle",
      delete: "idle",
      getList: "idle",
    },
    ownerErrors: { create: null, edit: null, delete: null, getList: null },
  },
  reducers: {},
  extraReducers: {
    [createRestaurant.pending]: (state, action) => {
      return {
        ...state,
        ownerStatus: { ...state.ownerStatus, create: "loading" },
      };
    },
    [createRestaurant.fulfilled]: (state, action) => {
      return {
        ...state,
        ownerStatus: { ...state.ownerStatus, create: "succeded" },
        ownerErrors: { ...state.ownerErrors, create: null },
        owner: action.payload,
      };
    },
    [createRestaurant.rejected]: (state, action) => {
      return {
        ...state,
        ownerStatus: { ...state.ownerStatus, create: "failed" },
        ownerErrors: { ...state.ownerErrors, create: action.payload },
      };
    },
    [getRestList.pending]: (state, action) => {
      return {
        ...state,
        ownerStatus: { ...state.ownerStatus, getList: "loading" },
      };
    },
    [getRestList.fulfilled]: (state, action) => {
      return {
        ...state,
        ownerStatus: { ...state.ownerStatus, getList: "succeded" },
        ownerErrors: { ...state.ownerErrors, getList: null },
        restList: action.payload,
      };
    },
    [getRestList.rejected]: (state, action) => {
      return {
        ...state,
        ownerStatus: { ...state.ownerStatus, getList: "failed" },
        ownerErrors: { ...state.ownerErrors, getList: action.payload },
      };
    },
    [deleteRestaurant.pending]: (state, action) => {
      return {
        ...state,
        ownerStatus: { ...state.ownerStatus, delete: "loading" },
      };
    },
    [deleteRestaurant.fulfilled]: (state, action) => {
      return {
        ...state,
        ownerStatus: { ...state.ownerStatus, delete: "succeded" },
        ownerErrors: { ...state.ownerErrors, delete: null },
      };
    },
    [deleteRestaurant.rejected]: (state, action) => {
      return {
        ...state,
        ownerStatus: { ...state.ownerStatus, delete: "failed" },
        ownerErrors: { ...state.ownerErrors, delete: action.payload },
      };
    },
    [editRestaurant.rejected]: (state, action) => {
      return {
        ...state,
        ownerStatus: { ...state.ownerStatus, edit: "failed" },
        ownerErrors: { ...state.ownerErrors, edit: action.payload },
      };
    },

    [editRestaurant.pending]: (state, action) => {
      return {
        ...state,
        ownerStatus: { ...state.ownerStatus, edit: "loading" },
      };
    },
    [editRestaurant.fulfilled]: (state, action) => {
      return {
        ...state,
        ownerStatus: { ...state.ownerStatus, edit: "succeded" },
        ownerErrors: { ...state.ownerErrors, edit: null },
      };
    },
  },
});

export default ownerSlice.reducer;
