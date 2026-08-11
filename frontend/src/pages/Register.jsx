import { useState } from "react";
import hero from "../assets/hero.png";
import { Icon } from "../components/Icons";
import { useAuth } from "../context/auth";
import { navigateTo, routes } from "../routes";

const Register = () => {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(form);
      navigateTo(routes.dashboard);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <div className="auth-logo"><Icon name="users" size={34} /></div>
        <h1>EMS</h1>
        <p>Employee Management System</p>
        <img src={hero} alt="" />
        <strong>Manage your employees efficiently and effectively</strong>
      </section>

      <section className="auth-form">
        <form onSubmit={submit}>
          <h2>Create Account</h2>
          <p>Register to manage employees</p>

          {error && <div className="alert">{error}</div>}

          <label>
            Account Type
            <span className="field select-field">
              <Icon name="user" size={16} />
              <select
                value={form.role}
                onChange={(event) => setForm({ ...form, role: event.target.value })}
                required
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </span>
          </label>

          <label>
            Full Name
            <span className="field">
              <Icon name="user" size={16} />
              <input
                type="text"
                placeholder="Enter your name"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                required
              />
            </span>
          </label>

          <label>
            Email
            <span className="field">
              <Icon name="mail" size={16} />
              <input
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                required
              />
            </span>
          </label>

          <label>
            Password
            <span className="field">
              <Icon name="lock" size={16} />
              <input
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                required
              />
            </span>
          </label>

          <button className="primary-button" type="submit" disabled={submitting}>
            {submitting ? "Creating..." : `Create ${form.role === "admin" ? "Admin" : "User"} Account`}
          </button>

          <p className="switch-auth">
            Already have an account?
            <button type="button" onClick={() => navigateTo(routes.login)}>Login</button>
          </p>
        </form>
      </section>
    </main>
  );
};

export default Register;
