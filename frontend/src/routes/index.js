export const routes = {
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
  addEmployee: "/employees/add",
  editEmployee: (id = ":id") => `/employees/${id}/edit`,
};

export const navigateTo = (path) => {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
};
