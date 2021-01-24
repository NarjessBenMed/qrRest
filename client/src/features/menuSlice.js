import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getMenuByRest = createAsyncThunk(
  "menu/rest-menu",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/menu/get-rest-menu/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteItemMenu = createAsyncThunk(
  "menu/delete-item",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.put("/menu/delete-item", data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const editItemMenu = createAsyncThunk(
  "menu/edit-item",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.put("/menu/edit-item", data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const addToMenu = createAsyncThunk(
  "restaurant/add-to-menu",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.put("/menu/update-menu", formData);

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const menuSlice = createSlice({
  name: "menu",
  initialState: {
    menu: null,
    menuErrors: { create: null, edit: null, delete: null, getMenu: null },
    menuStatus: {
      create: "idle",
      edit: "idle",
      delete: "idle",
      getMenu: "idle",
    },
  },
  reducers: {},
  extraReducers: {
    [getMenuByRest.pending]: (state, action) => {
      return {
        ...state,
        menuStatus: { ...state.menuStatus, getMenu: "loading" },
      };
    },
    [getMenuByRest.fulfilled]: (state, action) => {
      return {
        ...state,
        menuStatus: { ...state.menuStatus, getMenu: "succeded" },
        menuErrors: { ...state.menuErrors, getMenu: null },
        menu: action.payload,
      };
    },
    [getMenuByRest.rejected]: (state, action) => ({
      ...state,
      menuStatus: { ...state.menuStatus, getMenu: "failed" },
      menuErrors: { ...state.menuErrors, getMenu: action.payload },
    }),
    [addToMenu.pending]: (state, action) => {
      return {
        ...state,
        menuStatus: { ...state.menuStatus, create: "loading" },
      };
    },
    [addToMenu.fulfilled]: (state, action) => {
      return {
        ...state,
        menuStatus: { ...state.menuStatus, create: "succeded" },
        menuErrors: { ...state.menuErrors, create: null },
        menu: action.payload,
      };
    },
    [addToMenu.rejected]: (state, action) => ({
      ...state,
      menuStatus: { ...state.menuStatus, create: "failed" },
      menuErrors: { ...state.menuErrors, create: action.payload },
    }),

    [deleteItemMenu.pending]: (state, action) => {
      return {
        ...state,
        menuStatus: { ...state.menuStatus, delete: "loading" },
      };
    },
    [deleteItemMenu.fulfilled]: (state, action) => {
      return {
        ...state,
        menuStatus: { ...state.menuStatus, delete: "succeded" },
        menuErrors: { ...state.menuErrors, delete: null },
        menu: action.payload,
      };
    },
    [deleteItemMenu.rejected]: (state, action) => ({
      ...state,
      menuStatus: { ...state.menuStatus, delete: "failed" },
      menuErrors: { ...state.menuErrors, delete: action.payload },
    }),
    [editItemMenu.pending]: (state, action) => {
      return {
        ...state,
        menuStatus: { ...state.menuStatus, edit: "loading" },
      };
    },
    [editItemMenu.fulfilled]: (state, action) => {
      return {
        ...state,
        menuStatus: { ...state.menuStatus, edit: "succeded" },
        menuErrors: { ...state.menuErrors, edit: null },
        menu: action.payload,
      };
    },
    [editItemMenu.rejected]: (state, action) => ({
      ...state,
      menuStatus: { ...state.menuStatus, edit: "failed" },
      menuErrors: { ...state.menuErrors, edit: action.payload },
    }),
  },
});

export default menuSlice.reducer;
