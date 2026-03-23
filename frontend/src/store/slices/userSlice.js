import UserService from "@/services/api/user";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const name = "user";

const initialState = {
  users: [],
  totalUsers: 0,
  isFetching: false,
};

export const getUsers = createAsyncThunk(
  `${name}/getUsers`,
  async (params, { rejectWithValue }) => {
    try {
      const data = await UserService.getUsers(params);
      return data.data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clear: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isFetching = false;
        state.users = action.payload.rows;
        state.totalUsers = action.payload.count;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isFetching = false;
        console.error("Failed to fetch users:", action.payload);
      });
  },
});

export default userSlice.reducer;
export const { clear } = userSlice.actions;
