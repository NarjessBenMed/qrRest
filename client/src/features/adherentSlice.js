import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
export const getRestInfo = createAsyncThunk(
  "adherent/adherent",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.get("/adherent/adherent", {
        transformRequest: [
          (data, headers) => {
            delete headers.common.Authorization;

            return data;
          },
        ],
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const adherentSlice = createSlice({
  name: "adherent",
  initialState: {
    adherentStatus: "idle",
    adherents: null,
    errors: null,
  },
  reducers: {},
  extraReducers: {
    [getRestInfo.pending]: (state, action) => {
      return {
        ...state,
        adherentStatus: "loading",
      };
    },
    [getRestInfo.fulfilled]: (state, action) => {
      return {
        ...state,
        adherents: action.payload,
        adherentStatus: "succeded",
        errors: null,
      };
    },
    [getRestInfo.rejected]: (state, action) => {
      return {
        ...state,
        adherentStatus: "failed",
        errors: action.payload,
      };
    },
  },
});

export default adherentSlice.reducer;
