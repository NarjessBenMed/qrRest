import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// export const getMenu = createAsyncThunk(
//   "menu/get-menu",
//   async (data, { rejectWithValue }) => {
//     try {
//       const response = await axios.get("/menu/get-menu", data);
//       return response.data;
//     } catch (err) {
//       return rejectWithValue(err.response.data);
//     }
//   }
// );
export const getMenuByRest = createAsyncThunk(
  "menu/rest-menu",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/menu/get-rest-menu/${id}`);
      // console.log("respons", response.data);
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

export const menuSlice = createSlice({
  name: "menu",
  initialState: {
    menu: null,
    errors: null,
    status: "idle",
    updateStatus: "idle",
  },
  reducers: {},
  extraReducers: {
    // [getMenu.pending]: (state, action) => {
    //   state.status = "loading";
    // },
    // [getMenu.fulfilled]: (state, action) => {
    //   return {
    //     ...state,
    //     status: "succeded",
    //     menu: action.payload,
    //   };
    // },
    // [getMenu.rejected]: (state, action) => ({
    //   ...state,
    //   status: "failed",
    //   errors: action.payload,
    // }),
    [getMenuByRest.pending]: (state, action) => {
      state.status = "loading";
    },
    [getMenuByRest.fulfilled]: (state, action) => {
      return {
        ...state,
        status: "succeded",
        menu: action.payload,
      };
    },
    [getMenuByRest.rejected]: (state, action) => ({
      ...state,
      status: "failed",
      errors: action.payload,
    }),

    [deleteItemMenu.pending]: (state, action) => {
      state.updateStatus = "loading";
    },
    [deleteItemMenu.fulfilled]: (state, action) => {
      return {
        ...state,
        updateStatus: "succeded",
        menu: action.payload,
      };
    },
    [deleteItemMenu.rejected]: (state, action) => ({
      ...state,
      updateStatus: "failed",
      errors: action.payload,
    }),
    [editItemMenu.pending]: (state, action) => {
      state.updateStatus = "loading";
    },
    [editItemMenu.fulfilled]: (state, action) => {
      return {
        ...state,
        updateStatus: "succeded",
        menu: action.payload,
      };
    },
    [editItemMenu.rejected]: (state, action) => ({
      ...state,
      updateStatus: "failed",
      errors: action.payload,
    }),
  },
});

export default menuSlice.reducer;
