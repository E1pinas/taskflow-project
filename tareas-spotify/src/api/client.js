const LOCAL_API_BASE_URL = "http://localhost:3000/api/v1/tasks";

function getConfiguredApiBaseUrl() {
  const htmlConfig = document.documentElement.dataset.apiBaseUrl?.trim();

  if (htmlConfig) {
    return htmlConfig;
  }

  const isLocalHost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  if (isLocalHost) {
    return LOCAL_API_BASE_URL;
  }

  return `${window.location.origin}/api/v1/tasks`;
}

const API_BASE_URL = getConfiguredApiBaseUrl();

async function request(path = "", options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
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
