import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createOrder = createAsyncThunk(
  "order/create-order",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/order/create-order", formData.data);
      formData.history.push("/");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const updateOrder = createAsyncThunk(
  "order/update-order",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.put("/order/update-order", formData.data);
      formData.history.push("/");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const getOrderById = createAsyncThunk(
  "order/getById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/order/get-client-order/${id}`);

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const getAllOrders = createAsyncThunk(
  "order/getAll",
  async (restId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/order/get-order/${restId}`);

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const checkoutOrder = createAsyncThunk(
  "order/checkout-order",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.put("/order/checkout-order", orderId);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const orderSlice = createSlice({
  name: "order",
  initialState: {
    order: null,
    status: "idle",

    errors: null,
    orders: null,

    //----------//
  },
  reducers: {},
  extraReducers: {
    [createOrder.pending]: (state, action) => {
      state.status = "loading";
    },
    [createOrder.fulfilled]: (state, action) => {
      localStorage.removeItem("token");
      localStorage.removeItem("restId");
      localStorage.removeItem("tableNumber");
      localStorage.setItem("id", action.payload.id);
      return {
        ...state,
        order: action.payload,
        status: "succeded",
      };
    },
    [createOrder.rejected]: (state, action) => ({
      ...state,
      status: "failed",
      errors: action.payload,
    }),
    [updateOrder.pending]: (state, action) => {
      state.status = "loading";
    },
    [updateOrder.fulfilled]: (state, action) => {
      localStorage.removeItem("token");
      localStorage.removeItem("restId");
      localStorage.removeItem("tableNumber");
      return {
        ...state,
        order: action.payload,
        status: "succeded",
      };
    },
    [updateOrder.rejected]: (state, action) => ({
      ...state,
      status: "failed",
      errors: action.payload,
    }),
    [getOrderById.pending]: (state, action) => {
      state.status = "loading";
    },
    [getOrderById.fulfilled]: (state, action) => {
      return {
        ...state,
        order: action.payload,
        status: "succeded",
      };
    },
    [getOrderById.rejected]: (state, action) => ({
      ...state,
      status: "failed",
      errors: action.payload,
    }),
    [getAllOrders.pending]: (state, action) => {
      state.status = "loading";
    },
    [getAllOrders.fulfilled]: (state, action) => {
      return {
        ...state,
        orders: action.payload,
        status: "succeded",
      };
    },
    [getAllOrders.rejected]: (state, action) => ({
      ...state,
      status: "failed",
      errors: action.payload,
    }),
    [checkoutOrder.pending]: (state, action) => {
      state.status = "loading";
    },
    [checkoutOrder.fulfilled]: (state, action) => {
      return {
        ...state,
        order: action.payload,
        status: "succeded",
      };
    },
    [checkoutOrder.rejected]: (state, action) => ({
      ...state,
      status: "failed",
      errors: action.payload,
    }),
  },
});

export default orderSlice.reducer;
