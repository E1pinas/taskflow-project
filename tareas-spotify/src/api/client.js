const LOCAL_API_BASE_URL = "http://localhost:3000/api/v1/tasks";
const PROD_API_BASE_URL = "/api/v1/tasks";

function getApiBaseUrl() {
  if (typeof window === "undefined") {
    return PROD_API_BASE_URL;
  }

  const isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  return isLocalhost ? LOCAL_API_BASE_URL : PROD_API_BASE_URL;
}

async function request(path = "", options = {}) {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    throw new Error(data?.message || "No se pudo completar la solicitud.");
  }

  return data;
}

export function obtenerTareas() {
  return request();
}

export function crearTarea(payload) {
  return request("", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function actualizarTarea(id, payload) {
  return request(`/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function eliminarTarea(id) {
  return request(`/${id}`, {
    method: "DELETE",
  });
}
