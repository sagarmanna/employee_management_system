import Navbar from "../components/Navbar";
import { Icon } from "../components/Icons";
import { useAuth } from "../context/auth";

const Profile = () => {
  const { user } = useAuth();

  return (
    <main className="app-shell">
      <Navbar active="Profile" />
      <section className="content">
        <header className="page-header">
          <div>
            <span className="plain-icon"><Icon name="user" /></span>
            <h1>Profile</h1>
          </div>
        </header>

        <section className="detail-card">
          <div className="profile-hero">
            <span className="avatar large">{user?.name?.charAt(0)?.toUpperCase() || "A"}</span>
            <div>
              <h2>{user?.name || "Admin User"}</h2>
              <p>{user?.email || "Administrator"}</p>
            </div>
          </div>

          <div className="detail-grid">
            <article>
              <span>Role</span>
              <strong>Administrator</strong>
            </article>
            <article>
              <span>Account Status</span>
              <strong>Active</strong>
            </article>
            <article>
              <span>User ID</span>
              <strong>{user?.id || "-"}</strong>
            </article>
          </div>
        </section>
      </section>
    </main>
  );
};

export default Profile;
