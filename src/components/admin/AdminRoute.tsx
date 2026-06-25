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

  // Basic check to see if token is expired based on structure (if desired)
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp * 1000 < Date.now()) {
      localStorage.removeItem("admin_token");
      return <Navigate to="/admin/login" replace />;
    }
  } catch (e) {
    localStorage.removeItem("admin_token");
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};
