import DashboardService from "@/services/api/dashboard";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const name = "dashboard";

const initialState = {
  isFetching: false,
  data: {
    totalCustomer: 0,
    toralOrder: 0,
    totalSale: 0,
    toralPending: 0,
    toralVendor: 0,
    customerGrowth: 0,
    orderGrowth: 0,
    salesGrowth: 0,
    pendingOrderGrowth: 0,
    vendorGrowth: 0,
    graphData: [],
    expiryAlertProducts: {
      count: 0,
      rows: [],
    },
    topProducts: [],
  },
};

export const getDashboardData = createAsyncThunk(
  `${name}/getDashboardData`,
  async (_, { rejectWithValue }) => {
    try {
      const data = await DashboardService.getDashboardData();
      return data.data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getDashboardGraphData = createAsyncThunk(
  `${name}/getDashboardGraphData`,
  async (year, { rejectWithValue }) => {
    try {
      const data = await DashboardService.getDashboardGraphData(year);
      return data.data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getDashboardExpiryAlertData = createAsyncThunk(
  `${name}/getDashboardExpiryAlertData`,
  async (_, { rejectWithValue }) => {
    try {
      const data = await DashboardService.getDashboardExpiryAlertData();
      return data.data || { count: 0, rows: [] };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const getDashboardTopProductsData = createAsyncThunk(
  `${name}/getDashboardTopProductsData`,
  async (_, { rejectWithValue }) => {
    try {
      const data = await DashboardService.getDashboardTopProductsData();
      return data.data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clear: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardData.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(getDashboardData.fulfilled, (state, action) => {
        state.isFetching = false;
        state.data = {
          ...state.data,
          ...action.payload,
        };
      })
      .addCase(getDashboardData.rejected, (state, action) => {
        state.isFetching = false;
      })
      .addCase(getDashboardGraphData.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(getDashboardGraphData.fulfilled, (state, action) => {
        state.isFetching = false;
        state.graphData = action.payload;
      })
      .addCase(getDashboardGraphData.rejected, (state, action) => {
        state.isFetching = false;
        })
      .addCase(getDashboardExpiryAlertData.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(getDashboardExpiryAlertData.fulfilled, (state, action) => {
        state.isFetching = false;
        state.data.expiryAlertProducts = action.payload;
      })
      .addCase(getDashboardExpiryAlertData.rejected, (state, action) => {
        state.isFetching = false;
            })

      .addCase(getDashboardTopProductsData.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(getDashboardTopProductsData.fulfilled, (state, action) => {
        state.isFetching = false;
        state.data.topProducts = action.payload;
      })
      .addCase(getDashboardTopProductsData.rejected, (state, action) => {
        state.isFetching = false;
        console.error("Failed to fetch top products :", action.payload);
      });
  },
});

export default dashboardSlice.reducer;
export const { clear } = dashboardSlice.actions;
