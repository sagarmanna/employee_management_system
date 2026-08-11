import Navbar from "../components/Navbar";
import { Icon } from "../components/Icons";
import { useTheme } from "../context/theme";
import { useAuth } from "../context/auth";

const Settings = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <main className="app-shell">
      <Navbar active="Settings" />
      <section className="content">
        <header className="page-header">
          <div>
            <span className="plain-icon"><Icon name="settings" /></span>
            <h1>Settings</h1>
          </div>
        </header>

        <section className="detail-card">
          <h2>Preferences</h2>
          <div className="settings-row">
            <div>
              <strong>Role-Based Access</strong>
              <p>Your current role is {user?.role === "admin" ? "Administrator" : "User"}.</p>
            </div>
            <span className="role-pill">{user?.role || "user"}</span>
          </div>
          <div className="settings-row">
            <div>
              <strong>Dark Mode</strong>
              <p>Switch between light and dark dashboard themes.</p>
            </div>
            <button
              className="theme-toggle inline"
              type="button"
              onClick={toggleTheme}
              aria-pressed={isDark}
            >
              <span><Icon name="moon" size={18} /> Dark Mode</span>
              <i></i>
            </button>
          </div>
        </section>
      </section>
    </main>
  );
};

export default Settings;
