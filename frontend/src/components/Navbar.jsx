import { useState } from "react";
import { Icon } from "./Icons";
import { navigateTo, routes } from "../routes";
import { useAuth } from "../context/auth";
import { useTheme } from "../context/theme";
import { api } from "../services/api";

const navItems = [
  { label: "Dashboard", path: routes.dashboard, icon: "dashboard" },
  { label: "Employees", path: routes.dashboard, icon: "users" },
  { label: "Add Employee", path: routes.addEmployee, icon: "add" },
  { label: "Departments", path: routes.departments, icon: "building" },
  { label: "Profile", path: routes.profile, icon: "user" },
  { label: "Settings", path: routes.settings, icon: "settings" },
];

const Navbar = ({ active = "Dashboard" }) => {
  const { logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [modal, setModal] = useState(null);
  const [modalEmployees, setModalEmployees] = useState([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const csvValue = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;

  const fetchEmployees = async () => {
    const { employees } = await api.getEmployees();
    return employees;
  };

  const exportEmployees = async () => {
    setBusy(true);
    setMessage("");
    try {
      const employees = await fetchEmployees();
      if (!employees.length) {
        setMessage("No employee records available to export.");
        return;
      }

      const rows = [
        ["Name", "Email", "Department", "Salary", "Status", "Created At"],
        ...employees.map((employee) => [
          employee.name,
          employee.email,
          employee.department,
          employee.salary,
          employee.status,
          employee.createdAt,
        ]),
      ];
      const csv = rows.map((row) => row.map(csvValue).join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `employees-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setMessage(`Exported ${employees.length} employee records.`);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  };

  const openActivity = async () => {
    setBusy(true);
    setMessage("");
    try {
      const employees = await fetchEmployees();
      setModalEmployees(employees.slice(0, 8));
      setModal("activity");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  };

  const openHelp = () => {
    setModal("help");
    setMessage("");
  };

  return (
    <>
      <aside className="sidebar">
        <button className="brand" type="button" onClick={() => navigateTo(routes.dashboard)}>
          <span className="brand-icon"><Icon name="users" size={22} /></span>
          <span>
            <strong>EMS</strong>
            <small>Employee Management System</small>
          </span>
        </button>

        <nav className="nav-menu" aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              className={`nav-item ${active === item.label ? "active" : ""}`}
              key={item.label}
              type="button"
              onClick={() => navigateTo(item.path)}
              title={item.label}
            >
              <Icon name={item.icon} size={18} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="nav-extras">
          <p>Extras</p>
          <button
            className="nav-item subtle"
            type="button"
            title="Export employees"
            onClick={exportEmployees}
            disabled={busy}
          >
            <Icon name="file" size={18} />
            <span>{busy ? "Working..." : "Export"}</span>
          </button>
          <button
            className="nav-item subtle"
            type="button"
            title="Activity logs"
            onClick={openActivity}
            disabled={busy}
          >
            <Icon name="dashboard" size={18} />
            <span>Activity Logs</span>
          </button>
          <button className="nav-item subtle" type="button" title="Help and support" onClick={openHelp}>
            <Icon name="help" size={18} />
            <span>Help & Support</span>
          </button>
          {message && <small className="nav-message">{message}</small>}
        </div>

        <button
          className="theme-toggle"
          type="button"
          onClick={toggleTheme}
          aria-pressed={isDark}
          title="Toggle dark mode"
        >
          <span>
            <Icon name="moon" size={18} />
            Dark Mode
          </span>
          <i></i>
        </button>

        <button className="nav-item logout" type="button" onClick={logout}>
          <Icon name="logout" size={18} />
          <span>Logout</span>
        </button>
      </aside>

      {modal && (
        <div className="modal-backdrop" role="presentation" onClick={() => setModal(null)}>
          <section className="modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <header>
              <h2>{modal === "activity" ? "Activity Logs" : "Help & Support"}</h2>
              <button type="button" onClick={() => setModal(null)} title="Close">x</button>
            </header>

            {modal === "activity" ? (
              modalEmployees.length ? (
                <div className="modal-list">
                  {modalEmployees.map((employee) => (
                    <article key={employee.id}>
                      <span className="avatar small">{employee.name?.charAt(0)?.toUpperCase() || "E"}</span>
                      <p>
                        <strong>{employee.name}</strong>
                        <small>
                          {employee.department} record updated {new Date(employee.updatedAt || employee.createdAt).toLocaleString()}
                        </small>
                      </p>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="empty-state compact">No activity found.</div>
              )
            ) : (
              <div className="support-card">
                <p>For support, contact your EMS administrator or report the issue with the page, action, and time it happened.</p>
                <a href="mailto:support@example.com?subject=EMS%20Support%20Request">Email Support</a>
              </div>
            )}
          </section>
        </div>
      )}
    </>
  );
};

export default Navbar;
