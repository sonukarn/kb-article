// // src/pages/ResetPassword.jsx
// import React, { useState } from "react";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import { useResetPasswordMutation } from "@/features/auth/authApi";

// export default function ResetPassword() {
//   const [searchParams] = useSearchParams();
//   const token = searchParams.get("token");
//   const id = searchParams.get("id");
//   const navigate = useNavigate();

//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   const [resetPassword, { isLoading }] = useResetPasswordMutation();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setError("");

//     if (!password || !confirmPassword)
//       return setError("Both fields are required.");
//     if (password !== confirmPassword)
//       return setError("Passwords do not match.");

//     try {
//       const res = await resetPassword({
//         token,
//         id,
//         password,
//         confirmPassword,
//       }).unwrap();
//       setMessage(res.message || "Password reset successfully!");
//       setTimeout(() => navigate("/login"), 1500);
//     } catch (err) {
//       setError(err?.data?.message || "Invalid or expired link.");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center px-4">
//       <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 w-full max-w-md">
//         <h2 className="text-2xl font-semibold text-white text-center mb-6">
//           Reset Password
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm text-white/80 mb-2">
//               New Password
//             </label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="At least 8 characters"
//               className="w-full px-4 py-2 rounded-lg bg-white/5 text-white outline-none border border-white/10"
//             />
//           </div>

//           <div>
//             <label className="block text-sm text-white/80 mb-2">
//               Confirm Password
//             </label>
//             <input
//               type="password"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               placeholder="Repeat password"
//               className="w-full px-4 py-2 rounded-lg bg-white/5 text-white outline-none border border-white/10"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full py-2 rounded-lg bg-white text-indigo-700 font-semibold disabled:opacity-60"
//           >
//             {isLoading ? "Resetting..." : "Reset Password"}
//           </button>

//           {error && <p className="text-red-400 text-sm">{error}</p>}
//           {message && <p className="text-green-400 text-sm">{message}</p>}
//         </form>
//       </div>
//     </div>
//   );
// }

// src/pages/ResetPassword.jsx
import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useResetPasswordMutation } from "@/features/auth/authApi";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
// import toast, { Toaster } from "react-hot-toast";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const id = searchParams.get("id");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword)
      return toast.error("Both fields are required.");
    if (password !== confirmPassword)
      return toast.error("Passwords do not match.");

    try {
      const res = await resetPassword({
        token,
        id,
        password,
        confirmPassword,
      }).unwrap();
      toast.success(res.message || "Password reset successfully!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      toast.error(err?.data?.message || "Invalid or expired link.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#1f2937",
            color: "#fff",
            borderRadius: "10px",
            fontSize: "0.9rem",
          },
          success: { iconTheme: { primary: "#4ade80", secondary: "#1f2937" } },
          error: { iconTheme: { primary: "#f87171", secondary: "#1f2937" } },
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-white text-center mb-6">
          Reset Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="block text-sm text-white/80 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="w-full px-4 py-2 rounded-lg bg-white/5 text-white outline-none border border-white/10 focus:border-indigo-400 transition"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-sm text-white/80 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat password"
              className="w-full px-4 py-2 rounded-lg bg-white/5 text-white outline-none border border-white/10 focus:border-indigo-400 transition"
            />
          </motion.div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={isLoading}
            className="w-full py-2 rounded-lg bg-white text-indigo-700 font-semibold disabled:opacity-60 transition flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="h-4 w-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
