import {
  apiRequest,
  getCollectionFromPayload,
  getEntityFromPayload,
} from "./apiClient";

const COURSES_PATH = "/courses";

export async function getCourses() {
  const payload = await apiRequest(COURSES_PATH);
  return getCollectionFromPayload(payload, "courses");
}

export async function getCourseById(id) {
  const coursePath = `${COURSES_PATH}/${encodeURIComponent(String(id))}`;
  const payload = await apiRequest(coursePath);

  return getEntityFromPayload(payload);
}

export async function createCourse(values) {
  const payload = await apiRequest(COURSES_PATH, {
    method: "POST",
    body: JSON.stringify(values),
  });

  return getEntityFromPayload(payload);
}

export async function updateCourse(id, values) {
  const coursePath = `${COURSES_PATH}/${encodeURIComponent(String(id))}`;
  const payload = await apiRequest(coursePath, {
    method: "PATCH",
    body: JSON.stringify(values),
  });

  return getEntityFromPayload(payload);
}

export async function deleteCourse(id) {
  const coursePath = `${COURSES_PATH}/${encodeURIComponent(String(id))}`;

  await apiRequest(coursePath, {
    method: "DELETE",
  });

  return id;
}
