// src/pages/auth/PostLoginRedirect.jsx
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function PostLoginRedirect() {
  const { user, loading } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return; // wait until auth state is loaded
    if (!user) {
      navigate("/login");
      return;
    }

    // Redirect based on role
    if (user.role === "ADMIN") navigate("/admin");
    else navigate("/"); // normal user
  }, [user, loading, navigate]);

  return <div className="p-6 text-center">Redirecting...</div>;
}
