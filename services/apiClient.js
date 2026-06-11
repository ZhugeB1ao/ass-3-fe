export const DEFAULT_API_URL = "http://10.106.43.120:3000/api/v1";

export const API_BASE_URL = (
  process.env.EXPO_PUBLIC_API_URL || DEFAULT_API_URL
).replace(/\/+$/, "");

function getErrorMessage(payload, status) {
  if (typeof payload === "string" && payload.trim()) {
    return payload;
  }

  if (payload?.message) {
    return payload.message;
  }

  if (payload?.error) {
    return payload.error;
  }

  return `Yêu cầu không thành công (${status}).`;
}

async function parseResponse(response) {
  const responseText = await response.text();

  if (!responseText) {
    return null;
  }

  try {
    return JSON.parse(responseText);
  } catch {
    return responseText;
  }
}

export async function apiRequest(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        Accept: "application/json",
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error(
      `Không thể kết nối API tại ${API_BASE_URL}. Kiểm tra server và địa chỉ mạng.`,
    );
  }

  const payload = await parseResponse(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(payload, response.status));
  }

  return payload;
}

export function getCollectionFromPayload(payload, resourceName) {
  const possibleCollections = [
    payload,
    payload?.data,
    payload?.items,
    payload?.results,
    payload?.[resourceName],
    payload?.data?.items,
    payload?.data?.results,
    payload?.data?.[resourceName],
  ];

  const collection = possibleCollections.find((value) =>
    Array.isArray(value),
  );

  return collection || [];
}

export function getEntityFromPayload(payload) {
  if (!payload || Array.isArray(payload)) {
    return payload;
  }

  return payload.data ?? payload.item ?? payload.result ?? payload;
}
