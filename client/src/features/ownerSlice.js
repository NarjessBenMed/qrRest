import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

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
    status: "idle",
    errors: null,
    menu: null,
    //----------//
  },
  reducers: {},
  extraReducers: {
    [createRestaurant.pending]: (state, action) => {
      state.status = "loading";
    },
    [createRestaurant.fulfilled]: (state, action) => {
      return {
        ...state,
        status: "succeded",
        owner: action.payload,
        errors: null,
      };
    },
    [createRestaurant.rejected]: (state, action) => ({
      ...state,
      status: "failed",
      errors: action.payload,
    }),
    [getRestList.pending]: (state, action) => {
      state.status = "loading";
    },
    [getRestList.fulfilled]: (state, action) => {
      return {
        ...state,
        status: "succeded",
        restList: action.payload,
        errors: null,
      };
    },
    [getRestList.rejected]: (state, action) => ({
      ...state,
      status: "failed",
      errors: action.payload,
    }),
    [addToMenu.pending]: (state, action) => {
      state.status = "loading";
    },
    [addToMenu.fulfilled]: (state, action) => {
      return {
        ...state,
        status: "succeded",
        menu: action.payload,
        errors: null,
      };
    },
    [addToMenu.rejected]: (state, action) => ({
      ...state,
      status: "failed",
      errors: action.payload,
    }),
    [deleteRestaurant.pending]: (state, action) => {
      state.status = "loading";
    },
    [deleteRestaurant.fulfilled]: (state, action) => {
      return {
        ...state,
        status: "succeded",
        errors: null,
      };
    },
    [deleteRestaurant.rejected]: (state, action) => ({
      ...state,
      status: "failed",
      errors: action.payload,
    }),
    [editRestaurant.rejected]: (state, action) => ({
      ...state,
      status: "failed",
      errors: action.payload,
    }),

    [editRestaurant.pending]: (state, action) => {
      state.status = "loading";
    },
    [editRestaurant.fulfilled]: (state, action) => {
      return {
        ...state,
        status: "succeded",
        errors: null,
      };
    },
  },
});

export default ownerSlice.reducer;
