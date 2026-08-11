import { useEffect, useMemo, useState } from "react";
import { AuthContext } from "./auth";
import { api, setAuthToken } from "../services/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("ems_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(Boolean(localStorage.getItem("ems_token")));

  useEffect(() => {
    const token = localStorage.getItem("ems_token");
    if (!token) {
      setLoading(false);
      return;
    }

    setAuthToken(token);
    api
      .me()
      .then(({ user: currentUser }) => {
        setUser(currentUser);
        localStorage.setItem("ems_user", JSON.stringify(currentUser));
      })
      .catch(() => {
        setAuthToken("");
        localStorage.removeItem("ems_user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const saveSession = ({ token, user: nextUser }) => {
    setAuthToken(token);
    setUser(nextUser);
    localStorage.setItem("ems_user", JSON.stringify(nextUser));
  };

  const login = async (payload) => {
    const session = await api.login(payload);
    saveSession(session);
  };

  const register = async (payload) => {
    const session = await api.register(payload);
    saveSession(session);
  };

  const logout = () => {
    setAuthToken("");
    localStorage.removeItem("ems_user");
    setUser(null);
    window.history.pushState({}, "", "/login");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const value = useMemo(
    () => ({ user, loading, isAuthenticated: Boolean(user), login, register, logout }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
