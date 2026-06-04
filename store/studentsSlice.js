import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const BASE_URL = 'http://172.20.10.4:3000';

const toStringValue = (value) => {
  if (value === undefined || value === null) {
    return '';
  }
  return String(value);
};

const toNumberOrNull = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

const normalizeStudent = (raw = {}) => {
  return {
    id: toStringValue(raw.id ?? raw.Id ?? raw.ID),
    name: toStringValue(raw.name ?? raw.Name),
    university: toStringValue(raw.university ?? raw.University),
    email: toStringValue(raw.email ?? raw.Email),
    major: toStringValue(raw.major ?? raw.Major),
    gpa: toStringValue(raw.gpa ?? raw.GPA),
  };
};

const unwrapPayload = (payload) => {
  if (payload && payload.data !== undefined) {
    return payload.data;
  }
  return payload;
};

const normalizeList = (payload) => {
  if (Array.isArray(payload)) {
    return payload.map(normalizeStudent);
  }
  if (payload && Array.isArray(payload.data)) {
    return payload.data.map(normalizeStudent);
  }
  if (payload && Array.isArray(payload.students)) {
    return payload.students.map(normalizeStudent);
  }
  return [];
};

const toApiPayload = (student) => ({
  Id: student.id,
  Name: student.name,
  University: student.university,
  Email: student.email,
  Major: student.major || null,
  GPA: toNumberOrNull(student.gpa),
});

const readResponseText = async (response) => {
  try {
    return await response.text();
  } catch (error) {
    return '';
  }
};

const fetchJson = async (url, options = {}) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    const text = await readResponseText(response);
    throw new Error(text || `Request failed (${response.status})`);
  }
  if (response.status === 204) {
    return null;
  }
  const text = await readResponseText(response);
  if (!text) {
    return null;
  }
  try {
    return JSON.parse(text);
  } catch (error) {
    return null;
  }
};

export const fetchStudents = createAsyncThunk(
  'students/fetchAll',
  async () => {
    const data = await fetchJson(`${BASE_URL}/students`);
    return normalizeList(data);
  }
);

export const searchStudents = createAsyncThunk(
  'students/search',
  async (name) => {
    const params = new URLSearchParams({ name });
    const data = await fetchJson(
      `${BASE_URL}/students/search?${params.toString()}`
    );
    return normalizeList(data);
  }
);

export const createStudent = createAsyncThunk(
  'students/create',
  async (student) => {
    const data = await fetchJson(`${BASE_URL}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toApiPayload(student)),
    });
    return normalizeStudent(unwrapPayload(data) || student);
  }
);

export const updateStudent = createAsyncThunk(
  'students/update',
  async (student) => {
    const data = await fetchJson(
      `${BASE_URL}/students/${encodeURIComponent(student.id)}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toApiPayload(student)),
      }
    );
    return normalizeStudent(unwrapPayload(data) || student);
  }
);

export const deleteStudent = createAsyncThunk(
  'students/delete',
  async (id) => {
    await fetchJson(`${BASE_URL}/students/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    return id;
  }
);

const upsertStudent = (items, student) => {
  const index = items.findIndex((item) => item.id === student.id);
  if (index >= 0) {
    items[index] = student;
    return;
  }
  items.unshift(student);
};

const studentsSlice = createSlice({
  name: 'students',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    actionStatus: 'idle',
    actionError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error?.message || 'Khong the tai du lieu.';
      })
      .addCase(searchStudents.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(searchStudents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(searchStudents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error?.message || 'Khong the tim kiem.';
      })
      .addCase(createStudent.pending, (state) => {
        state.actionStatus = 'loading';
        state.actionError = null;
      })
      .addCase(createStudent.fulfilled, (state, action) => {
        state.actionStatus = 'succeeded';
        upsertStudent(state.items, action.payload);
      })
      .addCase(createStudent.rejected, (state, action) => {
        state.actionStatus = 'failed';
        state.actionError =
          action.error?.message || 'Khong the tao sinh vien.';
      })
      .addCase(updateStudent.pending, (state) => {
        state.actionStatus = 'loading';
        state.actionError = null;
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        state.actionStatus = 'succeeded';
        upsertStudent(state.items, action.payload);
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.actionStatus = 'failed';
        state.actionError = action.error?.message || 'Khong the cap nhat.';
      })
      .addCase(deleteStudent.pending, (state) => {
        state.actionStatus = 'loading';
        state.actionError = null;
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.actionStatus = 'succeeded';
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.actionStatus = 'failed';
        state.actionError =
          action.error?.message || 'Khong the xoa sinh vien.';
      });
  },
});

export default studentsSlice.reducer;
