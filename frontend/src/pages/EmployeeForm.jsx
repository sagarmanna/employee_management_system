import { useEffect, useState } from "react";
import { Icon } from "../components/Icons";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/auth";
import { navigateTo, routes } from "../routes";
import { api } from "../services/api";

const departments = ["IT", "HR", "Finance", "Marketing", "Operations", "Sales"];

const EmployeeForm = ({ mode, id }) => {
  const isEdit = mode === "edit";
  const { user } = useAuth();
  const canManageEmployees = user?.role === "admin";
  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    salary: "",
    status: "active",
  });
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    api
      .getEmployee(id)
      .then(({ employee }) =>
        setForm({
          name: employee.name || "",
          email: employee.email || "",
          department: employee.department || "",
          salary: String(Number(employee.salary || 0)),
          status: employee.status || "active",
        }),
      )
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const payload = { ...form, salary: Number(form.salary) };
      if (isEdit) {
        await api.updateEmployee(id, payload);
      } else {
        await api.createEmployee(payload);
      }
      navigateTo(routes.dashboard);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="app-shell">
      <Navbar active={isEdit ? "Employees" : "Add Employee"} />
      <section className="content">
        <header className="page-header">
          <div>
            <button className="plain-icon" type="button" onClick={() => navigateTo(routes.dashboard)} title="Back">
              <Icon name="back" />
            </button>
            <h1>{isEdit ? "Edit Employee" : "Add Employee"}</h1>
          </div>
          <p><button type="button" onClick={() => navigateTo(routes.dashboard)}>Dashboard</button> / {isEdit ? "Edit Employee" : "Add Employee"}</p>
        </header>

        <section className="form-card">
          <h2>Employee Information</h2>
          {!canManageEmployees ? (
            <div className="empty-state compact">Only administrators can add or edit employee records.</div>
          ) : loading ? (
            <Loader />
          ) : (
            <form className="employee-form" onSubmit={submit}>
              {error && <div className="alert wide">{error}</div>}
              <label>
                Full Name <span>*</span>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={form.name}
                  onChange={(event) => update("name", event.target.value)}
                  required
                />
              </label>
              <label>
                Email <span>*</span>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={form.email}
                  onChange={(event) => update("email", event.target.value)}
                  required
                />
              </label>
              <label>
                Department <span>*</span>
                <select
                  value={form.department}
                  onChange={(event) => update("department", event.target.value)}
                  required
                >
                  <option value="">Select department</option>
                  {departments.map((department) => (
                    <option key={department} value={department}>{department}</option>
                  ))}
                </select>
              </label>
              <label>
                Salary <span>*</span>
                <input
                  type="number"
                  min="0"
                  placeholder="Enter salary"
                  value={form.salary}
                  onChange={(event) => update("salary", event.target.value)}
                  required
                />
              </label>
              <label>
                Status
                <select value={form.status} onChange={(event) => update("status", event.target.value)}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </label>
              <div className="form-actions">
                <button className="secondary-button" type="button" onClick={() => navigateTo(routes.dashboard)}>
                  Cancel
                </button>
                <button className="primary-button compact" type="submit" disabled={submitting}>
                  {submitting ? "Saving..." : isEdit ? "Update Employee" : "Save Employee"}
                </button>
              </div>
            </form>
          )}
        </section>
      </section>
    </main>
  );
};

export default EmployeeForm;
