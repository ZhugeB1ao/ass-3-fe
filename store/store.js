import { configureStore } from "@reduxjs/toolkit";
import classesReducer from "./classesSlice";
import coursesReducer from "./coursesSlice";
import studentsReducer from "./studentsSlice";

const store = configureStore({
  reducer: {
    students: studentsReducer,
    courses: coursesReducer,
    classes: classesReducer,
  },
});

export default store;
