import { getCurrentUser } from "@/lib/utils";
import { createSlice } from "@reduxjs/toolkit";

const initialModalOpen = {
  id: null,
  data: null,
};

const initialState = {
  sidebarOpen: true,
  permissions: getCurrentUser("permissions") || [],
  modalOpen: initialModalOpen,
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    setModalOpen: (state, action) => {
      state.modalOpen = action.payload || initialModalOpen;
    },
    setPermissions: (state, action) => {
      state.permissions = action.payload;
    },
    clear: (state) => ({ ...initialState, permissions: state.permissions }),
  },
});

export default globalSlice.reducer;
export const { setModalOpen, setSidebarOpen, setPermissions, clear } =
  globalSlice.actions;
