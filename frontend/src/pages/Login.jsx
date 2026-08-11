import { useState } from "react";
import hero from "../assets/hero.png";
import { Icon } from "../components/Icons";
import { useAuth } from "../context/auth";
import { navigateTo, routes } from "../routes";
import { api } from "../services/api";

const Login = () => {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "", role: "user" });
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form);
      navigateTo(routes.dashboard);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const submitForgotPassword = async (event) => {
    event.preventDefault();
    setForgotMessage("");
    setSubmitting(true);
    try {
      const { message } = await api.forgotPassword({ email: forgotEmail });
      setForgotMessage(message);
    } catch (err) {
      setForgotMessage(err.message);
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
          <h2>Welcome Back!</h2>
          <p>Please sign in to continue</p>

          {error && <div className="alert">{error}</div>}

          <label>
            Login Type
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
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} title="Show password">
                <Icon name="eye" size={16} />
              </button>
            </span>
          </label>

          <div className="auth-options">
            <label className="checkbox">
              <input
                type="checkbox"
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
              />
              Remember me
            </label>
            <button
              type="button"
              onClick={() => {
                setForgotEmail(form.email);
                setForgotOpen(true);
                setForgotMessage("");
              }}
            >
              Forgot Password?
            </button>
          </div>

          <button className="primary-button" type="submit" disabled={submitting}>
            {submitting ? "Signing in..." : `Login as ${form.role === "admin" ? "Admin" : "User"}`}
          </button>

          <p className="switch-auth">
            Don't have an account?
            <button type="button" onClick={() => navigateTo(routes.register)}>Sign up</button>
          </p>
        </form>
      </section>

      {forgotOpen && (
        <div className="modal-backdrop" role="presentation" onClick={() => setForgotOpen(false)}>
          <section className="modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <header>
              <h2>Forgot Password</h2>
              <button type="button" onClick={() => setForgotOpen(false)} title="Close">x</button>
            </header>
            <form className="support-card" onSubmit={submitForgotPassword}>
              <label>
                Email
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(event) => setForgotEmail(event.target.value)}
                  placeholder="Enter your account email"
                  required
                />
              </label>
              {forgotMessage && <div className="alert">{forgotMessage}</div>}
              <button className="primary-button compact" type="submit" disabled={submitting}>
                {submitting ? "Checking..." : "Submit"}
              </button>
            </form>
          </section>
        </div>
      )}
    </main>
  );
};

export default Login;
