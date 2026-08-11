const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

let authToken = localStorage.getItem("ems_token") || "";

export const setAuthToken = (token) => {
  authToken = token || "";
  if (authToken) {
    localStorage.setItem("ems_token", authToken);
  } else {
    localStorage.removeItem("ems_token");
  }
};

const request = async (path, options = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

export const api = {
  login: (payload) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  register: (payload) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  me: () => request("/auth/me"),
  updateProfile: (payload) =>
    request("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  getEmployees: (search = "") =>
    request(`/employees${search ? `?search=${encodeURIComponent(search)}` : ""}`),
  getEmployee: (id) => request(`/employees/${id}`),
  createEmployee: (payload) =>
    request("/employees", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateEmployee: (id, payload) =>
    request(`/employees/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  deleteEmployee: (id) =>
    request(`/employees/${id}`, {
      method: "DELETE",
    }),
  getStats: () => request("/employees/stats"),
};
