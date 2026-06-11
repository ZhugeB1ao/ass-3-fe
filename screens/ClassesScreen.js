import ResourceManagementView from "../components/ResourceManagementView";
import {
  clearClassDetails,
  clearClassMutationState,
  createClass,
  deleteClass,
  fetchClassById,
  fetchClasses,
  updateClass,
} from "../store/classesSlice";

const classActions = {
  fetchItems: fetchClasses,
  fetchItemById: fetchClassById,
  createItem: createClass,
  updateItem: updateClass,
  deleteItem: deleteClass,
  clearMutation: clearClassMutationState,
  clearDetails: clearClassDetails,
};

function selectClassesState(state) {
  return state.classes;
}

export default function ClassesScreen({ onNavigate }) {
  return (
    <ResourceManagementView
      resource="classes"
      actions={classActions}
      selectResourceState={selectClassesState}
      onNavigate={onNavigate}
    />
  );
}
