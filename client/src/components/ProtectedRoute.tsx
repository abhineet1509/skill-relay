import { Navigate, Outlet, Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { Lock } from "lucide-react";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-gray-900 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-20 h-20 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-5">
          <Lock className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Authentication Required</h2>
        <p className="text-gray-500 mb-8 text-lg">Please log in to your account to view this page.</p>
        <Link 
          to="/login" 
          className="bg-gray-900 hover:bg-gray-700 text-white font-semibold py-3.5 px-10 rounded-xl shadow-md transition-colors text-lg"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-5">
          <Lock className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Access Denied</h2>
        <p className="text-gray-500 mb-8 text-lg">You do not have permission to view this page.</p>
        <Link 
          to="/" 
          className="bg-gray-900 hover:bg-gray-700 text-white font-semibold py-3.5 px-10 rounded-xl shadow-md transition-colors text-lg"
        >
          Return Home
        </Link>
      </div>
    );
  }

  return <Outlet />;
}
