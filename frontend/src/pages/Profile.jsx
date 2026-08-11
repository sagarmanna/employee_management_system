import { useState } from "react";
import Navbar from "../components/Navbar";
import { Icon } from "../components/Icons";
import { useAuth } from "../context/auth";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const uploadImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please choose an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      setSaving(true);
      try {
        await updateProfile({ profileImage: reader.result });
        setMessage("Profile image updated.");
      } catch (error) {
        setMessage(error.message);
      } finally {
        setSaving(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await updateProfile({ name });
      setMessage("Profile updated.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

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
            {user?.profileImage ? (
              <img className="profile-image" src={user.profileImage} alt={user?.name || "Profile"} />
            ) : (
              <span className="avatar large">{user?.name?.charAt(0)?.toUpperCase() || "A"}</span>
            )}
            <div>
              <h2>{user?.name || "Admin User"}</h2>
              <p>{user?.email || "Administrator"}</p>
            </div>
          </div>

          <form className="profile-form" onSubmit={saveProfile}>
            <label>
              Full Name
              <input value={name} onChange={(event) => setName(event.target.value)} required />
            </label>
            <label>
              Profile Image
              <input type="file" accept="image/*" onChange={uploadImage} />
            </label>
            <button className="primary-button compact" type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </form>
          {message && <p className="action-message">{message}</p>}

          <div className="detail-grid">
            <article>
              <span>Role</span>
              <strong>{user?.role === "admin" ? "Administrator" : "User"}</strong>
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
