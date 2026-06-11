import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createStudent as createStudentRequest,
  deleteStudent as deleteStudentRequest,
  getStudentById,
  getStudents,
  updateStudent as updateStudentRequest,
} from "../services/studentsService";

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

export const fetchStudents = createAsyncThunk(
  "students/fetchStudents",
  async () => {
    return await getStudents();
  },
);

export const createStudent = createAsyncThunk(
  "students/createStudent",
  async (values) => {
    return await createStudentRequest(values);
  },
);

export const fetchStudentById = createAsyncThunk(
  "students/fetchStudentById",
  async (id) => {
    return await getStudentById(id);
  },
);

export const updateStudent = createAsyncThunk(
  "students/updateStudent",
  async ({ id, values }) => {
    return await updateStudentRequest(id, values);
  },
);

export const deleteStudent = createAsyncThunk(
  "students/deleteStudent",
  async (id) => {
    return await deleteStudentRequest(id);
  },
);

const studentsSlice = createSlice({
  name: "students",
  initialState,
  reducers: {
    clearStudentMutationState(state) {
      state.mutationStatus = "idle";
      state.mutationError = null;
    },
    clearStudentDetails(state) {
      state.selectedItem = null;
      state.detailStatus = "idle";
      state.detailError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Không thể tải sinh viên.";
      })
      .addCase(fetchStudentById.pending, (state) => {
        state.detailStatus = "loading";
        state.detailError = null;
        state.selectedItem = null;
      })
      .addCase(fetchStudentById.fulfilled, (state, action) => {
        state.detailStatus = "succeeded";
        state.selectedItem = action.payload;
      })
      .addCase(fetchStudentById.rejected, (state, action) => {
        state.detailStatus = "failed";
        state.detailError =
          action.error.message || "Không thể tải chi tiết sinh viên.";
      })
      .addCase(createStudent.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(createStudent.fulfilled, (state) => {
        state.mutationStatus = "succeeded";
      })
      .addCase(createStudent.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError =
          action.error.message || "Không thể tạo sinh viên.";
      })
      .addCase(updateStudent.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(updateStudent.fulfilled, (state) => {
        state.mutationStatus = "succeeded";
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError =
          action.error.message || "Không thể cập nhật sinh viên.";
      })
      .addCase(deleteStudent.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(deleteStudent.fulfilled, (state) => {
        state.mutationStatus = "succeeded";
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError =
          action.error.message || "Không thể xóa sinh viên.";
      });
  },
});

export const { clearStudentDetails, clearStudentMutationState } =
  studentsSlice.actions;
export default studentsSlice.reducer;
