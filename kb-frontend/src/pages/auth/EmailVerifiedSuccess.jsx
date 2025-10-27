import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function EmailVerifiedSuccess() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-emerald-600 to-teal-500">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.32 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-3xl p-8 text-center border border-white/20 shadow-lg"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/30 mx-auto mb-4">
          {/* Check icon */}
          <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none">
            <path
              d="M20 6L9 17l-5-5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">Email Verified</h2>
        <p className="text-white/80 mb-6">
          Your account is now active — welcome aboard!
        </p>

        <button
          onClick={() => navigate("/login")}
          className="w-full bg-white text-emerald-600 py-2 rounded-xl font-semibold hover:bg-emerald-50"
        >
          Go to Login
        </button>
      </motion.div>
    </div>
  );
}
