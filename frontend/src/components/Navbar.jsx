import { Icon } from "./Icons";
import { navigateTo, routes } from "../routes";
import { useAuth } from "../context/auth";
import { useTheme } from "../context/theme";

const navItems = [
  { label: "Dashboard", path: routes.dashboard, icon: "dashboard" },
  { label: "Employees", path: routes.dashboard, icon: "users" },
  { label: "Add Employee", path: routes.addEmployee, icon: "add" },
  { label: "Departments", path: routes.dashboard, icon: "building" },
  { label: "Profile", path: routes.dashboard, icon: "user" },
  { label: "Settings", path: routes.dashboard, icon: "settings" },
];

const Navbar = ({ active = "Dashboard" }) => {
  const { logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
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
        <button className="nav-item subtle" type="button" title="Export">
          <Icon name="file" size={18} />
          <span>Export</span>
        </button>
        <button className="nav-item subtle" type="button" title="Activity logs">
          <Icon name="dashboard" size={18} />
          <span>Activity Logs</span>
        </button>
        <button className="nav-item subtle" type="button" title="Help and support">
          <Icon name="help" size={18} />
          <span>Help & Support</span>
        </button>
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
  );
};

export default Navbar;
