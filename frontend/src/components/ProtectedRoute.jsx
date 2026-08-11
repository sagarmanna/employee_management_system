import { useEffect } from "react";
import { routes } from "../routes";
import { useAuth } from "../context/auth";
import Loader from "./Loader";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.history.replaceState({}, "", routes.login);
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  }, [isAuthenticated, loading]);

  if (loading) {
    return <Loader label="Checking session" />;
  }

  return isAuthenticated ? children : null;
};

export default ProtectedRoute;
