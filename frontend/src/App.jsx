import { useEffect, useMemo, useState } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/auth";
import { ThemeProvider } from "./context/ThemeContext";
import AddEmployee from "./pages/AddEmployee";
import Dashboard from "./pages/Dashboard";
import EditEmployee from "./pages/EditEmployee";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { routes } from "./routes";

const usePath = () => {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const updatePath = () => setPath(window.location.pathname);
    window.addEventListener("popstate", updatePath);
    return () => window.removeEventListener("popstate", updatePath);
  }, []);

  return path;
};

const AppRoutes = () => {
  const path = usePath();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && path === "/" && isAuthenticated) {
      window.history.replaceState({}, "", routes.dashboard);
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
    if (!loading && path === "/" && !isAuthenticated) {
      window.history.replaceState({}, "", routes.login);
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  }, [isAuthenticated, loading, path]);

  const editId = useMemo(() => {
    const match = path.match(/^\/employees\/([^/]+)\/edit$/);
    return match?.[1] || null;
  }, [path]);

  if (path === routes.register) return <Register />;
  if (path === routes.login) return <Login />;
  if (path === routes.addEmployee) {
    return (
      <ProtectedRoute>
        <AddEmployee />
      </ProtectedRoute>
    );
  }
  if (editId) {
    return (
      <ProtectedRoute>
        <EditEmployee id={editId} />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
};

const App = () => (
  <ThemeProvider>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </ThemeProvider>
);

export default App;
