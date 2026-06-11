import ResourceManagementView from "../components/ResourceManagementView";
import {
  clearStudentDetails,
  clearStudentMutationState,
  createStudent,
  deleteStudent,
  fetchStudentById,
  fetchStudents,
  updateStudent,
} from "../store/studentsSlice";

const studentActions = {
  fetchItems: fetchStudents,
  fetchItemById: fetchStudentById,
  createItem: createStudent,
  updateItem: updateStudent,
  deleteItem: deleteStudent,
  clearMutation: clearStudentMutationState,
  clearDetails: clearStudentDetails,
};

function selectStudentsState(state) {
  return state.students;
}

export default function StudentsScreen({ onNavigate }) {
  return (
    <ResourceManagementView
      resource="students"
      actions={studentActions}
      selectResourceState={selectStudentsState}
      onNavigate={onNavigate}
    />
  );
}
