import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isSignedIn } = useAuth();
  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
