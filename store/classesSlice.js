import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createClass as createClassRequest,
  deleteClass as deleteClassRequest,
  getClassById,
  getClasses,
  updateClass as updateClassRequest,
} from "../services/classesService";

const initialState = {
  items: [],
  status: "idle",
  error: null,
  mutationStatus: "idle",
  mutationError: null,
  selectedItem: null,
  detailStatus: "idle",
  detailError: null,
};

export const fetchClasses = createAsyncThunk(
  "classes/fetchClasses",
  async () => {
    return await getClasses();
  },
);

export const createClass = createAsyncThunk(
  "classes/createClass",
  async (values) => {
    return await createClassRequest(values);
  },
);

export const fetchClassById = createAsyncThunk(
  "classes/fetchClassById",
  async (id) => {
    return await getClassById(id);
  },
);

export const updateClass = createAsyncThunk(
  "classes/updateClass",
  async ({ id, values }) => {
    return await updateClassRequest(id, values);
  },
);

export const deleteClass = createAsyncThunk(
  "classes/deleteClass",
  async (id) => {
    return await deleteClassRequest(id);
  },
);

const classesSlice = createSlice({
  name: "classes",
  initialState,
  reducers: {
    clearClassMutationState(state) {
      state.mutationStatus = "idle";
      state.mutationError = null;
    },
    clearClassDetails(state) {
      state.selectedItem = null;
      state.detailStatus = "idle";
      state.detailError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClasses.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Không thể tải lớp học.";
      })
      .addCase(fetchClassById.pending, (state) => {
        state.detailStatus = "loading";
        state.detailError = null;
        state.selectedItem = null;
      })
      .addCase(fetchClassById.fulfilled, (state, action) => {
        state.detailStatus = "succeeded";
        state.selectedItem = action.payload;
      })
      .addCase(fetchClassById.rejected, (state, action) => {
        state.detailStatus = "failed";
        state.detailError =
          action.error.message || "Không thể tải chi tiết lớp học.";
      })
      .addCase(createClass.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(createClass.fulfilled, (state) => {
        state.mutationStatus = "succeeded";
      })
      .addCase(createClass.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError = action.error.message || "Không thể tạo lớp học.";
      })
      .addCase(updateClass.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(updateClass.fulfilled, (state) => {
        state.mutationStatus = "succeeded";
      })
      .addCase(updateClass.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError =
          action.error.message || "Không thể cập nhật lớp học.";
      })
      .addCase(deleteClass.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(deleteClass.fulfilled, (state) => {
        state.mutationStatus = "succeeded";
      })
      .addCase(deleteClass.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError = action.error.message || "Không thể xóa lớp học.";
      });
  },
});

export const { clearClassDetails, clearClassMutationState } =
  classesSlice.actions;
export default classesSlice.reducer;
