import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

interface AdminRouteProps {
  children: ReactNode;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const token = localStorage.getItem("admin_token");
  
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  // Frontend token format validation is removed because `atob` crashes on base64url characters (- and _),
  // which falsely triggers token deletion. The backend is responsible for verifying the token signature and expiration.

  return <>{children}</>;
};
