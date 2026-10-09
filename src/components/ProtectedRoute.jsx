import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import TallyDot from "./TallyDot";

// Heads up: the WeTube backend applies verifyJWT to every route in
// video.routes.js, including browsing and watching. There's no public,
// logged-out viewing — so the whole app sits behind this guard.
export default function ProtectedRoute() {
  const { user, checkingSession } = useAuth();
  const location = useLocation();

  if (checkingSession) {
    return (
      <div className="flex h-screen items-center justify-center gap-2 font-mono text-sm text-muted">
        <TallyDot />
        CONNECTING…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
