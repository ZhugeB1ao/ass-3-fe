import {
  apiRequest,
  getCollectionFromPayload,
  getEntityFromPayload,
} from "./apiClient";

const STUDENTS_PATH = "/students";

export async function getStudents() {
  const payload = await apiRequest(STUDENTS_PATH);
  return getCollectionFromPayload(payload, "students");
}

export async function getStudentById(id) {
  const studentPath = `${STUDENTS_PATH}/${encodeURIComponent(String(id))}`;
  const payload = await apiRequest(studentPath);

  return getEntityFromPayload(payload);
}

export async function createStudent(values) {
  const payload = await apiRequest(STUDENTS_PATH, {
    method: "POST",
    body: JSON.stringify(values),
  });

  return getEntityFromPayload(payload);
}

export async function updateStudent(id, values) {
  const studentPath = `${STUDENTS_PATH}/${encodeURIComponent(String(id))}`;
  const payload = await apiRequest(studentPath, {
    method: "PATCH",
    body: JSON.stringify(values),
  });

  return getEntityFromPayload(payload);
}

export async function deleteStudent(id) {
  const studentPath = `${STUDENTS_PATH}/${encodeURIComponent(String(id))}`;

  await apiRequest(studentPath, {
    method: "DELETE",
  });

  return id;
}
