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

  const cards = [
    { label: "Total Employees", value: stats.totalEmployees, note: "Live employee records", tone: "blue", icon: "users" },
    { label: "Departments", value: stats.departments, note: "Total Departments", tone: "green", icon: "user" },
    { label: "Total Salary", value: money.format(stats.totalSalary), note: "Current payroll total", tone: "gold", icon: "user" },
    { label: "Active Employees", value: stats.activeEmployees, note: `${activePercent} of total`, tone: "violet", icon: "users" },
  ];

  const recentEmployees = employees.slice(0, 3);

  return (
    <main className="app-shell">
      <Navbar active="Dashboard" />
      <section className="content">
        <header className="topbar">
          <button className="plain-icon" type="button" title="Menu"><Icon name="menu" /></button>
          <h1>Dashboard</h1>
          <div className="top-actions">
            <button className="plain-icon" type="button" title="Search"><Icon name="search" /></button>
            <button className="plain-icon notification" type="button" title="Notifications"><Icon name="bell" /></button>
            <div className="user-menu">
              <button
                className="user-chip"
                type="button"
                onClick={() => setUserMenuOpen((open) => !open)}
                aria-expanded={userMenuOpen}
                aria-haspopup="menu"
              >
                <span className="avatar small">{user?.name?.charAt(0)?.toUpperCase() || "A"}</span>
                <span><strong>{user?.name || "Admin User"}</strong><small>Administrator</small></span>
                <Icon name="chevron" size={14} />
              </button>

              {userMenuOpen && (
                <div className="user-dropdown" role="menu">
                  <div className="dropdown-head">
                    <span className="avatar small">{user?.name?.charAt(0)?.toUpperCase() || "A"}</span>
                    <p>
                      <strong>{user?.name || "Admin User"}</strong>
                      <small>{user?.email || "Administrator"}</small>
                    </p>
                  </div>
                  <button type="button" role="menuitem">
                    <Icon name="user" size={17} />
                    Profile
                  </button>
                  <button type="button" role="menuitem">
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
            <button className="primary-button compact" type="button" onClick={() => navigateTo(routes.addEmployee)}>
              <Icon name="plus" size={18} />
              Add Employee
            </button>
          </div>

          {error && <div className="alert">{error}</div>}
          {loading ? (
            <Loader />
          ) : employees.length ? (
            <>
              <EmployeeTable employees={employees} onDelete={deleteEmployee} />
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
              <button type="button" onClick={() => navigateTo(routes.addEmployee)}>
                <span className="stat-icon green"><Icon name="users" /></span>
                Add Employee
              </button>
              <button type="button">
                <span className="stat-icon violet"><Icon name="file" /></span>
                Export Data
              </button>
              <button type="button">
                <span className="stat-icon blue"><Icon name="building" /></span>
                Departments
              </button>
              <button type="button">
                <span className="stat-icon gold"><Icon name="dashboard" /></span>
                View Reports
              </button>
            </div>
          </article>

          <article className="panel recent-activity">
            <header>
              <h2>Recent Activity</h2>
              <button type="button">View All</button>
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
    </main>
  );
};

export default Dashboard;
