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
    orderStatus: {
      create: "idle",
      edit: "idle",
      getOne: "idle",
      getAll: "idle",
      checkout: "idle",
    },
    orderErrors: {
      create: null,
      edit: null,
      getOne: null,
      getAll: null,
      checkout: null,
    },
    orders: null,
  },
  reducers: {},
  extraReducers: {
    [createOrder.pending]: (state, action) => {
      return {
        ...state,
        orderStatus: { ...state.orderStatus, create: "loading" },
      };
    },
    [createOrder.fulfilled]: (state, action) => {
      localStorage.removeItem("token");
      localStorage.removeItem("restId");
      localStorage.removeItem("tableNumber");
      localStorage.setItem("id", action.payload.id);
      return {
        ...state,
        order: action.payload,
        orderStatus: { ...state.orderStatus, create: "succeded" },
        orderErrors: { ...state.orderErrors, create: null },
      };
    },
    [createOrder.rejected]: (state, action) => {
      return {
        ...state,
        orderStatus: { ...state.orderStatus, create: "failed" },

        orderErrors: { ...state.orderErrors, create: action.payload },
      };
    },
    [updateOrder.pending]: (state, action) => {
      return {
        ...state,
        orderStatus: { ...state.orderStatus, edit: "loading" },
      };
    },
    [updateOrder.fulfilled]: (state, action) => {
      localStorage.removeItem("token");
      localStorage.removeItem("restId");
      localStorage.removeItem("tableNumber");
      return {
        ...state,
        order: action.payload,
        orderStatus: { ...state.orderStatus, edit: "succeded" },
        orderErrors: { ...state.orderErrors, edit: null },
      };
    },
    [updateOrder.rejected]: (state, action) => {
      return {
        ...state,
        orderStatus: { ...state.orderStatus, edit: "failed" },
        orderErrors: { ...state.orderErrors, edit: action.payload },
      };
    },
    [getOrderById.pending]: (state, action) => {
      return {
        ...state,
        orderStatus: { ...state.orderStatus, getOne: "loading" },
      };
    },
    [getOrderById.fulfilled]: (state, action) => {
      return {
        ...state,
        order: action.payload,
        orderStatus: { ...state.orderStatus, getOne: "succeded" },
        orderErrors: { ...state.orderErrors, getOne: null },
      };
    },
    [getOrderById.rejected]: (state, action) => {
      return {
        ...state,
        orderStatus: { ...state.orderStatus, getOne: "failed" },
        orderErrors: { ...state.orderErrors, getOne: action.payload },
      };
    },
    [getAllOrders.pending]: (state, action) => {
      return {
        ...state,
        orderStatus: { ...state.orderStatus, getAll: "loading" },
      };
    },
    [getAllOrders.fulfilled]: (state, action) => {
      return {
        ...state,
        orders: action.payload,
        orderStatus: { ...state.orderStatus, getAll: "succeded" },
        orderErrors: { ...state.orderErrors, getAll: null },
      };
    },
    [getAllOrders.rejected]: (state, action) => {
      return {
        ...state,
        orderStatus: { ...state.orderStatus, getAll: "failed" },
        orderErrors: { ...state.orderErrors, getAll: action.payload },
      };
    },
    [checkoutOrder.pending]: (state, action) => {
      return {
        ...state,
        orderStatus: { ...state.orderStatus, checkout: "loading" },
      };
    },
    [checkoutOrder.fulfilled]: (state, action) => {
      return {
        ...state,
        order: action.payload,
        orderStatus: { ...state.orderStatus, checkout: "succeded" },
        orderErrors: { ...state.orderErrors, checkout: null },
      };
    },
    [checkoutOrder.rejected]: (state, action) => {
      return {
        ...state,
        orderStatus: { ...state.orderStatus, checkout: "failed" },
        orderErrors: { ...state.orderErrors, checkout: action.payload },
      };
    },
  },
});

export default orderSlice.reducer;
