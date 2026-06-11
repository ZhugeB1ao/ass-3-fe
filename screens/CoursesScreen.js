import ResourceManagementView from "../components/ResourceManagementView";
import {
  clearCourseDetails,
  clearCourseMutationState,
  createCourse,
  deleteCourse,
  fetchCourseById,
  fetchCourses,
  updateCourse,
} from "../store/coursesSlice";

const courseActions = {
  fetchItems: fetchCourses,
  fetchItemById: fetchCourseById,
  createItem: createCourse,
  updateItem: updateCourse,
  deleteItem: deleteCourse,
  clearMutation: clearCourseMutationState,
  clearDetails: clearCourseDetails,
};

function selectCoursesState(state) {
  return state.courses;
}

export default function CoursesScreen({ onNavigate }) {
  return (
    <ResourceManagementView
      resource="courses"
      actions={courseActions}
      selectResourceState={selectCoursesState}
      onNavigate={onNavigate}
    />
  );
}
