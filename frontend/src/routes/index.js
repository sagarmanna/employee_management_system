export const routes = {
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
  employees: "/employees",
  addEmployee: "/employees/add",
  departments: "/departments",
  profile: "/profile",
  settings: "/settings",
  editEmployee: (id = ":id") => `/employees/${id}/edit`,
};

export const navigateTo = (path) => {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
};
