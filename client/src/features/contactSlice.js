import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const contactUs = createAsyncThunk(
  "contact/sendEmail",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post("/contact/sendEmail", data);

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const contactSlice = createSlice({
  name: "contact",
  initialState: {
    contactStatus: "idle",

    errors: null,
  },
  reducers: {},
  extraReducers: {
    [contactUs.pending]: (state, action) => {
      return {
        ...state,
        contactStatus: "loading",
      };
    },
    [contactUs.fulfilled]: (state, action) => {
      return {
        ...state,
        contactStatus: "succeded",
        errors: null,
      };
    },
    [contactUs.rejected]: (state, action) => {
      return {
        ...state,
        contactStatus: "failed",
        errors: action.payload,
      };
    },
  },
});

export default contactSlice.reducer;
