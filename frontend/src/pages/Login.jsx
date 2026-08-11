import { useState } from "react";
import hero from "../assets/hero.png";
import { Icon } from "../components/Icons";
import { useAuth } from "../context/auth";
import { navigateTo, routes } from "../routes";

const Login = () => {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
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
            <button type="button">Forgot Password?</button>
          </div>

          <button className="primary-button" type="submit" disabled={submitting}>
            {submitting ? "Signing in..." : "Login"}
          </button>

          <p className="switch-auth">
            Don't have an account?
            <button type="button" onClick={() => navigateTo(routes.register)}>Sign up</button>
          </p>
        </form>
      </section>
    </main>
  );
};

export default Login;
