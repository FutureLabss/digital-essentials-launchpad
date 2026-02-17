import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, profile } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Check if user is admin (you can customize this logic)
  // For now, we'll check if email contains 'admin' or a specific admin email
  const isAdmin = profile?.email?.includes("admin") || 
                  profile?.email === "admin@futurelabs.com" ||
                  profile?.email === "manassehudim@gmail.com";

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
