import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const authClient = createAsyncThunk(
  "auth/auth-client",
  async (data, { rejectWithValue }) => {
    try {
      const { restId, tableNumber, history } = data;
      console.log("restid", restId);
      console.log("restid", tableNumber);
      console.log("history", history);
      const response = await axios.post("/auth/auth-client", {
        restId,
        tableNumber,
      });
      localStorage.setItem("restId", restId);
      localStorage.setItem("tableNumber", tableNumber);
      history.push("/client-page");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const login = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post("/auth/login", data);
      if (response.data.role === "admin") {
        data.history.push("/admin-section");
      } else if (response.data.role === "owner") {
        data.history.push("/owner-section");
      } else if (response.data.role === "worker") {
        data.history.push("/worker-section");
      } else {
        data.history.push("/");
      }
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("token"),
    isAuthenticated: false,
    isClient: false,
    authStatus: { authClient: "idle", authUser: "idle" },
    authErrors: { authClient: null, authUser: null },
    user: null,
  },
  reducers: {
    clearClient(state) {
      return { ...state, isClient: false };
    },
    logout(state) {
      localStorage.removeItem("token");
      return { ...state, token: null, isAuthenticated: false, user: null };
    },
    initState(state) {
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        isClient: false,
        authStatus: { authClient: "idle", authUser: "idle" },
        authErrors: { authClient: null, authUser: null },
        user: null,
      };
    },
  },
  extraReducers: {
    [login.pending]: (state, action) => {
      return {
        ...state,
        authStatus: { ...state.authStatus, authUser: "loading" },
      };
    },
    [login.fulfilled]: (state, action) => {
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        authStatus: { ...state.authStatus, authUser: "succeded" },
        authErrors: { ...state.authErrors, authUser: null },

        isAuthenticated: true,
        user: action.payload,
      };
    },
    [login.rejected]: (state, action) => {
      return {
        ...state,
        authStatus: { ...state.authStatus, authUser: "failed" },
        authErrors: { ...state.authErrors, authUser: action.payload },
      };
    },
    [authClient.pending]: (state, action) => {
      return {
        ...state,
        authStatus: { ...state.authStatus, authClient: "loading" },
      };
    },
    [authClient.fulfilled]: (state, action) => {
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,

        authStatus: { ...state.authStatus, authClient: "succeded" },
        authErrors: { ...state.authErrors, authClient: action.payload },
        isClient: true,
      };
    },
    [authClient.rejected]: (state, action) => ({
      ...state,
      authStatus: { ...state.authStatus, authClient: "failed" },
      authErrors: { ...state.authErrors, authClient: action.payload },
    }),
  },
});

export const { logout, initState, clearClient } = authSlice.actions;
export default authSlice.reducer;
