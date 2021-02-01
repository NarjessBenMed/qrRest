import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const addTable = createAsyncThunk(
  "table/add-table",
  async (FormData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/table/create-table", FormData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const getTables = createAsyncThunk(
  "table/get-tables",
  async (id, { rejectWithValue }) => {
    try {
      console.log("id rest", id);
      const response = await axios.get(`/table/my-tables/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const deleteTable = createAsyncThunk(
  "table/del-table",
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
  name: "table",
  initialState: {
    tableStatus: { create: "idle", delete: "idle", getAll: "idle" },
    tableErrors: { create: null, delete: null, getAll: null },
    table: null,
    listTable: null,
  },
  reducers: {},
  extraReducers: {
    [addTable.pending]: (state, action) => {
      return {
        ...state,
        tableStatus: { ...state.tableStatus, create: "loading" },
      };
    },
    [addTable.fulfilled]: (state, action) => {
      return {
        ...state,
        table: action.payload,
        tableStatus: { ...state.tableStatus, create: "succeded" },
        tableErrors: { ...state.tableErrors, create: null },
      };
    },
    [addTable.rejected]: (state, action) => {
      return {
        ...state,
        tableStatus: { ...state.tableStatus, create: "failed" },
        tableErrors: { ...state.tableErrors, create: action.payload },
      };
    },
    [getTables.pending]: (state, action) => {
      return {
        ...state,
        tableStatus: { ...state.tableStatus, getAll: "loading" },
      };
    },
    [getTables.fulfilled]: (state, action) => {
      return {
        ...state,
        listTable: action.payload,
        tableStatus: { ...state.tableStatus, getAll: "succeded" },
        tableErrors: { ...state.tableErrors, getAll: null },
      };
    },
    [getTables.rejected]: (state, action) => {
      return {
        ...state,
        tableStatus: { ...state.tableStatus, getAll: "failed" },
        tableErrors: { ...state.tableErrors, getAll: action.payload },
      };
    },
    [deleteTable.pending]: (state, action) => {
      return {
        ...state,
        tableStatus: { ...state.tableStatus, delete: "loading" },
      };
    },
    [deleteTable.fulfilled]: (state, action) => {
      return {
        ...state,
        tableStatus: { ...state.tableStatus, delete: "succeded" },
        tableErrors: { ...state.tableErrors, delete: null },
      };
    },
    [deleteTable.rejected]: (state, action) => {
      return {
        ...state,
        tableStatus: { ...state.tableStatus, delete: "failed" },
        tableErrors: { ...state.tableErrors, delete: action.payload },
      };
    },
  },
});
export default tableSlice.reducer;
