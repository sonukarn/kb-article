import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

export default function EmailVerificationSent() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "your@email.com";
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState("");
  const [err, setErr] = useState("");

  const API = import.meta.env.VITE_API_URL || "/api";

  async function handleResend() {
    // try {
    //   setErr("");
    //   setInfo("");
    //   setLoading(true);
    //   const res = await fetch(`${API}/auth/resend-verification`, {
    //     method: "POST",
    //     credentials: "include",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ email }),
    //   });
    //   const data = await res.json();
    //   if (!res.ok) throw new Error(data?.message || "Failed to resend");
    //   setInfo(data.message || "Verification email resent.");
    // } catch (e) {
    //   setErr(e.message || "Could not resend verification email.");
    // } finally {
    //   setLoading(false);
    // }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-pink-500 p-6">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.36 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 text-center shadow-xl"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 mx-auto mb-4">
          {/* mail SVG */}
          <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 8.5l9 6 9-6"
              stroke="white"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect
              x="2"
              y="4"
              width="20"
              height="16"
              rx="2"
              stroke="white"
              strokeWidth="1.2"
              fill="none"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">
          Verify your email
        </h2>
        <p className="text-white/80 mb-4">
          We've sent a verification link to
          <br />
          <span className="font-semibold text-white">{email}</span>
        </p>

        <button
          onClick={() => navigate("/login")}
          className="w-full bg-white text-indigo-600 py-2 rounded-xl font-semibold mb-3 hover:bg-indigo-50 transition"
        >
          Go to Login
        </button>

        <button
          onClick={handleResend}
          disabled={loading}
          className="w-full py-2 rounded-xl border border-white/20 text-white/90 mb-2 hover:bg-white/5 transition"
        >
          {loading ? "Resending..." : "Resend Verification Email"}
        </button>

        {info && <p className="mt-3 text-green-300 text-sm">{info}</p>}
        {err && <p className="mt-3 text-red-300 text-sm">{err}</p>}

        <p className="text-white/70 text-sm mt-5">
          Didn’t receive the email? Check your spam folder, or click resend.
        </p>
      </motion.div>
    </div>
  );
}
