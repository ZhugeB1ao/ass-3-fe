import {
  apiRequest,
  getCollectionFromPayload,
  getEntityFromPayload,
} from "./apiClient";

const CLASSES_PATH = "/classes";

export async function getClasses() {
  const payload = await apiRequest(CLASSES_PATH);
  return getCollectionFromPayload(payload, "classes");
}

export async function getClassById(id) {
  const classPath = `${CLASSES_PATH}/${encodeURIComponent(String(id))}`;
  const payload = await apiRequest(classPath);

  return getEntityFromPayload(payload);
}

export async function createClass(values) {
  const payload = await apiRequest(CLASSES_PATH, {
    method: "POST",
    body: JSON.stringify(values),
  });

  return getEntityFromPayload(payload);
}

export async function updateClass(id, values) {
  const classPath = `${CLASSES_PATH}/${encodeURIComponent(String(id))}`;
  const payload = await apiRequest(classPath, {
    method: "PATCH",
    body: JSON.stringify(values),
  });

  return getEntityFromPayload(payload);
}

export async function deleteClass(id) {
  const classPath = `${CLASSES_PATH}/${encodeURIComponent(String(id))}`;

  await apiRequest(classPath, {
    method: "DELETE",
  });

  return id;
}
