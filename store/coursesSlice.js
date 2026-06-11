import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createCourse as createCourseRequest,
  deleteCourse as deleteCourseRequest,
  getCourseById,
  getCourses,
  updateCourse as updateCourseRequest,
} from "../services/coursesService";

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

export const fetchCourses = createAsyncThunk(
  "courses/fetchCourses",
  async () => {
    return await getCourses();
  },
);

export const createCourse = createAsyncThunk(
  "courses/createCourse",
  async (values) => {
    return await createCourseRequest(values);
  },
);

export const fetchCourseById = createAsyncThunk(
  "courses/fetchCourseById",
  async (id) => {
    return await getCourseById(id);
  },
);

export const updateCourse = createAsyncThunk(
  "courses/updateCourse",
  async ({ id, values }) => {
    return await updateCourseRequest(id, values);
  },
);

export const deleteCourse = createAsyncThunk(
  "courses/deleteCourse",
  async (id) => {
    return await deleteCourseRequest(id);
  },
);

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    clearCourseMutationState(state) {
      state.mutationStatus = "idle";
      state.mutationError = null;
    },
    clearCourseDetails(state) {
      state.selectedItem = null;
      state.detailStatus = "idle";
      state.detailError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Không thể tải môn học.";
      })
      .addCase(fetchCourseById.pending, (state) => {
        state.detailStatus = "loading";
        state.detailError = null;
        state.selectedItem = null;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.detailStatus = "succeeded";
        state.selectedItem = action.payload;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.detailStatus = "failed";
        state.detailError =
          action.error.message || "Không thể tải chi tiết môn học.";
      })
      .addCase(createCourse.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(createCourse.fulfilled, (state) => {
        state.mutationStatus = "succeeded";
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError =
          action.error.message || "Không thể tạo môn học.";
      })
      .addCase(updateCourse.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(updateCourse.fulfilled, (state) => {
        state.mutationStatus = "succeeded";
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError =
          action.error.message || "Không thể cập nhật môn học.";
      })
      .addCase(deleteCourse.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(deleteCourse.fulfilled, (state) => {
        state.mutationStatus = "succeeded";
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError =
          action.error.message || "Không thể xóa môn học.";
      });
  },
});

export const { clearCourseDetails, clearCourseMutationState } =
  coursesSlice.actions;
export default coursesSlice.reducer;
