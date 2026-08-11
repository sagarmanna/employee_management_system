import { useEffect, useMemo, useState } from "react";
import EmployeeTable from "../components/EmployeeTable";
import { Icon } from "../components/Icons";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/auth";
import { useTheme } from "../context/theme";
import { navigateTo, routes } from "../routes";
import { api } from "../services/api";

const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    departments: 0,
    totalSalary: 0,
    activeEmployees: 0,
  });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [actionModal, setActionModal] = useState(null);
  const [actionMessage, setActionMessage] = useState("");

  const loadData = async (term = search) => {
    setLoading(true);
    setError("");
    try {
      const [employeeData, statData] = await Promise.all([
        api.getEmployees(term),
        api.getStats(),
      ]);
      setEmployees(employeeData.employees);
      setStats(statData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData("");
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => loadData(search), 250);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const closeMenu = (event) => {
      if (!event.target.closest(".user-menu")) {
        setUserMenuOpen(false);
      }
      if (!event.target.closest(".notification-menu")) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, []);

  const activePercent = useMemo(() => {
    if (!stats.totalEmployees) return "0%";
    return `${Math.round((stats.activeEmployees / stats.totalEmployees) * 100)}%`;
  }, [stats.activeEmployees, stats.totalEmployees]);

  const deleteEmployee = async (id) => {
    if (!confirm("Delete this employee?")) return;
    await api.deleteEmployee(id);
    loadData();
  };

  const tableValue = (value) =>
    String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

  const exportEmployees = async () => {
    setActionMessage("");
    try {
      const { employees: allEmployees } = await api.getEmployees();
      if (!allEmployees.length) {
        setActionMessage("No employee records available to export.");
        return;
      }

      const body = allEmployees
        .map((employee) => `
          <tr>
            <td>${tableValue(employee.name)}</td>
            <td>${tableValue(employee.email)}</td>
            <td>${tableValue(employee.department)}</td>
            <td>${tableValue(employee.salary)}</td>
            <td>${tableValue(employee.status)}</td>
            <td>${tableValue(employee.createdAt)}</td>
          </tr>
        `)
        .join("");
      const excel = `
        <table>
          <thead><tr><th>Name</th><th>Email</th><th>Department</th><th>Salary</th><th>Status</th><th>Created At</th></tr></thead>
          <tbody>${body}</tbody>
        </table>
      `;
      const blob = new Blob([excel], { type: "application/vnd.ms-excel;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `employees-${new Date().toISOString().slice(0, 10)}.xls`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setActionMessage(`Exported ${allEmployees.length} employee records.`);
    } catch (err) {
      setActionMessage(err.message);
    }
  };

  const cards = [
    { label: "Total Employees", value: stats.totalEmployees, note: "Live employee records", tone: "blue", icon: "users" },
    { label: "Departments", value: stats.departments, note: "Total Departments", tone: "green", icon: "user" },
    { label: "Total Salary", value: money.format(stats.totalSalary), note: "Current payroll total", tone: "gold", icon: "user" },
    { label: "Active Employees", value: stats.activeEmployees, note: `${activePercent} of total`, tone: "violet", icon: "users" },
  ];
  const canManageEmployees = user?.role === "admin";

  const recentEmployees = employees.slice(0, 3);
  const notificationItems = employees.slice(0, 5);
  const departmentRows = useMemo(() => {
    const counts = employees.reduce((result, employee) => {
      result[employee.department] = (result[employee.department] || 0) + 1;
      return result;
    }, {});

    return Object.entries(counts).map(([department, count]) => ({ department, count }));
  }, [employees]);

  return (
    <main className="app-shell">
      <Navbar active="Dashboard" />
      <section className="content">
        <header className="topbar">
          <button className="plain-icon" type="button" title="Menu"><Icon name="menu" /></button>
          <h1>Dashboard</h1>
          <div className="top-actions">
            <button className="plain-icon" type="button" title="Search"><Icon name="search" /></button>
            <div className="notification-menu">
              <button
                className="plain-icon notification"
                type="button"
                title="Notifications"
                onClick={() => setNotificationOpen((open) => !open)}
                aria-expanded={notificationOpen}
                aria-haspopup="menu"
              >
                <Icon name="bell" />
              </button>

              {notificationOpen && (
                <div className="notification-dropdown" role="menu">
                  <header>
                    <h2>Notifications</h2>
                    <button type="button" onClick={() => setActionModal("activity")}>View All</button>
                  </header>
                  {notificationItems.length ? (
                    <div className="notification-list">
                      {notificationItems.map((employee) => (
                        <article key={employee.id}>
                          <span className="stat-icon green"><Icon name="plus" size={16} /></span>
                          <p>
                            <strong>{employee.name}</strong>
                            <small>
                              {employee.department} employee record updated
                            </small>
                          </p>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state compact">No notifications yet.</div>
                  )}
                </div>
              )}
            </div>
            <div className="user-menu">
              <button
                className="user-chip"
                type="button"
                onClick={() => setUserMenuOpen((open) => !open)}
                aria-expanded={userMenuOpen}
                aria-haspopup="menu"
              >
                {user?.profileImage ? (
                  <img className="avatar-image small" src={user.profileImage} alt={user?.name || "Profile"} />
                ) : (
                  <span className="avatar small">{user?.name?.charAt(0)?.toUpperCase() || "A"}</span>
                )}
                <span><strong>{user?.name || "Admin User"}</strong><small>Administrator</small></span>
                <Icon name="chevron" size={14} />
              </button>

              {userMenuOpen && (
                <div className="user-dropdown" role="menu">
                  <div className="dropdown-head">
                    {user?.profileImage ? (
                      <img className="avatar-image small" src={user.profileImage} alt={user?.name || "Profile"} />
                    ) : (
                      <span className="avatar small">{user?.name?.charAt(0)?.toUpperCase() || "A"}</span>
                    )}
                    <p>
                      <strong>{user?.name || "Admin User"}</strong>
                      <small>{user?.email || "Administrator"}</small>
                    </p>
                  </div>
                  <button type="button" role="menuitem" onClick={() => navigateTo(routes.profile)}>
                    <Icon name="user" size={17} />
                    Profile
                  </button>
                  <button type="button" role="menuitem" onClick={() => navigateTo(routes.settings)}>
                    <Icon name="settings" size={17} />
                    Settings
                  </button>
                  <button type="button" role="menuitem" onClick={toggleTheme}>
                    <Icon name="moon" size={17} />
                    {isDark ? "Light Mode" : "Dark Mode"}
                  </button>
                  <button className="danger" type="button" role="menuitem" onClick={logout}>
                    <Icon name="logout" size={17} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <section className="stats-grid">
          {cards.map((card) => (
            <article className="stat-card" key={card.label}>
              <span className={`stat-icon ${card.tone}`}><Icon name={card.icon} /></span>
              <div>
                <p>{card.label}</p>
                <strong>{card.value}</strong>
                <small>{card.note}</small>
              </div>
            </article>
          ))}
        </section>

        <section className="panel">
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
            <button className="filter-button" type="button" title="Filter employees">
              <Icon name="filter" size={18} />
            </button>
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

        <section className="dashboard-bottom">
          <article className="panel quick-actions">
            <h2>Quick Actions</h2>
            <div>
              <button
                type="button"
                onClick={() => navigateTo(routes.addEmployee)}
                disabled={!canManageEmployees}
                title={canManageEmployees ? "Add employee" : "Only admins can add employees"}
              >
                <span className="stat-icon green"><Icon name="users" /></span>
                Add Employee
              </button>
              <button type="button" onClick={exportEmployees}>
                <span className="stat-icon violet"><Icon name="file" /></span>
                Export Data
              </button>
              <button type="button" onClick={() => setActionModal("departments")}>
                <span className="stat-icon blue"><Icon name="building" /></span>
                Departments
              </button>
              <button type="button" onClick={() => setActionModal("reports")}>
                <span className="stat-icon gold"><Icon name="dashboard" /></span>
                View Reports
              </button>
            </div>
            {actionMessage && <p className="action-message">{actionMessage}</p>}
          </article>

          <article className="panel recent-activity">
            <header>
              <h2>Recent Activity</h2>
              <button type="button" onClick={() => setActionModal("activity")}>View All</button>
            </header>
            {recentEmployees.length ? (
              <div className="activity-list">
                {recentEmployees.map((employee) => (
                  <div className="activity-item" key={employee.id}>
                    <span className="stat-icon green"><Icon name="plus" size={18} /></span>
                    <p>
                      <strong>{employee.name}</strong> employee record is available
                      <small>{new Date(employee.updatedAt || employee.createdAt).toLocaleString()}</small>
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state compact">No recent activity yet.</div>
            )}
          </article>
        </section>
      </section>

      {actionModal && (
        <div className="modal-backdrop" role="presentation" onClick={() => setActionModal(null)}>
          <section className="modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <header>
              <h2>
                {actionModal === "departments" && "Departments"}
                {actionModal === "reports" && "Reports"}
                {actionModal === "activity" && "Activity Logs"}
              </h2>
              <button type="button" onClick={() => setActionModal(null)} title="Close">x</button>
            </header>

            {actionModal === "departments" && (
              departmentRows.length ? (
                <div className="modal-list">
                  {departmentRows.map((row) => (
                    <article key={row.department}>
                      <span className="stat-icon blue"><Icon name="building" size={18} /></span>
                      <p>
                        <strong>{row.department}</strong>
                        <small>{row.count} employee{row.count === 1 ? "" : "s"}</small>
                      </p>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="empty-state compact">No departments found.</div>
              )
            )}

            {actionModal === "reports" && (
              <div className="report-grid">
                <article>
                  <span>Total Employees</span>
                  <strong>{stats.totalEmployees}</strong>
                </article>
                <article>
                  <span>Active Employees</span>
                  <strong>{stats.activeEmployees}</strong>
                </article>
                <article>
                  <span>Departments</span>
                  <strong>{stats.departments}</strong>
                </article>
                <article>
                  <span>Total Salary</span>
                  <strong>{money.format(stats.totalSalary)}</strong>
                </article>
              </div>
            )}

            {actionModal === "activity" && (
              employees.length ? (
                <div className="modal-list">
                  {employees.slice(0, 8).map((employee) => (
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
            )}
          </section>
        </div>
      )}
    </main>
  );
};

export default Dashboard;
