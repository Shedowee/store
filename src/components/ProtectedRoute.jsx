import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { role } = useUser();

  if (role === "guest") {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && role !== "admin") {
    // Logged in but not admin
    return <Navigate to="/" replace />;
  }

  return children;
}
