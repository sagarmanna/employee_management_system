import { useEffect, useState } from "react";
import EmployeeTable from "../components/EmployeeTable";
import { Icon } from "../components/Icons";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/auth";
import { navigateTo, routes } from "../routes";
import { api } from "../services/api";

const Employees = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const canManageEmployees = user?.role === "admin";

  const loadEmployees = async (term = search) => {
    setLoading(true);
    setError("");
    try {
      const { employees: rows } = await api.getEmployees(term);
      setEmployees(rows);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees("");
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => loadEmployees(search), 250);
    return () => clearTimeout(timer);
  }, [search]);

  const deleteEmployee = async (id) => {
    if (!confirm("Delete this employee?")) return;
    await api.deleteEmployee(id);
    loadEmployees();
  };

  return (
    <main className="app-shell">
      <Navbar active="Employees" />
      <section className="content">
        <header className="page-header">
          <div>
            <span className="plain-icon"><Icon name="users" /></span>
            <h1>Employees</h1>
          </div>
        </header>

        <section className="panel employees-panel">
          <div className="toolbar">
            <label className="search-box">
              <input
                type="search"
                placeholder="Search employees by name, email or department..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <Icon name="search" size={18} />
            </label>
            <button
              className="primary-button compact"
              type="button"
              onClick={() => navigateTo(routes.addEmployee)}
              disabled={!canManageEmployees}
              title={canManageEmployees ? "Add employee" : "Only admins can add employees"}
            >
              <Icon name="plus" size={18} />
              Add Employee
            </button>
          </div>

          {error && <div className="alert">{error}</div>}
          {loading ? (
            <Loader />
          ) : employees.length ? (
            <>
              <EmployeeTable employees={employees} onDelete={deleteEmployee} canManage={canManageEmployees} />
              <div className="table-footer">Showing {employees.length} employee records</div>
            </>
          ) : (
            <div className="empty-state">No employee records found.</div>
          )}
        </section>
      </section>
    </main>
  );
};

export default Employees;
