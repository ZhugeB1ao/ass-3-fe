import { useEffect, useState } from "react";
import { Provider, useDispatch } from "react-redux";
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from "react-native-safe-area-context";
import ClassesScreen from "./screens/ClassesScreen";
import CoursesScreen from "./screens/CoursesScreen";
import StudentsScreen from "./screens/StudentsScreen";
import { fetchClasses } from "./store/classesSlice";
import { fetchCourses } from "./store/coursesSlice";
import store from "./store/store";
import { fetchStudents } from "./store/studentsSlice";

const SCREENS = {
  students: StudentsScreen,
  courses: CoursesScreen,
  classes: ClassesScreen,
};

function AppContent() {
  const dispatch = useDispatch();
  const [activeScreen, setActiveScreen] = useState("students");
  const ActiveScreen = SCREENS[activeScreen];

  useEffect(() => {
    dispatch(fetchStudents());
    dispatch(fetchCourses());
    dispatch(fetchClasses());
  }, [dispatch]);

  return <ActiveScreen onNavigate={setActiveScreen} />;
}

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <AppContent />
      </SafeAreaProvider>
    </Provider>
  );
}
