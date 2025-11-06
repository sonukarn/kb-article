// import React, { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useNavigate } from "react-router-dom";

// /**
//  * Dummy ForgotPassword UI flow:
//  *  - Step "email": enter email or phone (WhatsApp)
//  *  - Step "sent" : enter OTP (6 digits)
//  *  - Step "reset": set new password
//  *
//  * This file is purely client-side simulation (no network). Use it to check UI/UX.
//  */

// const OTP_LENGTH = 6;

// const SectionWrapper = ({ children, keyProp }) => (
//   <motion.div
//     key={keyProp}
//     initial={{ opacity: 0, scale: 0.98 }}
//     animate={{ opacity: 1, scale: 1 }}
//     exit={{ opacity: 0, scale: 0.98 }}
//     transition={{ duration: 0.22 }}
//     className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 w-full max-w-md"
//   >
//     {children}
//   </motion.div>
// );

// export default function ForgotPassword() {
//   const [step, setStep] = useState("email"); // email | sent | reset
//   const [method, setMethod] = useState("email"); // email | phone
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [infoMsg, setInfoMsg] = useState("");
//   const [errMsg, setErrMsg] = useState("");
//   const navigate = useNavigate();

//   const resetAll = () => {
//     setMethod("email");
//     setEmail("");
//     setPhone("");
//     setOtp(Array(OTP_LENGTH).fill(""));
//     setNewPassword("");
//     setConfirmPassword("");
//     setInfoMsg("");
//     setErrMsg("");
//     setLoading(false);
//     setStep("email");
//   };

//   // simple email validation for demo
//   const isValidEmail = (em) => /^\S+@\S+\.\S+$/.test(em) && em.length > 5;

//   const isValidPhone = (ph) => /^\+?\d{7,15}$/.test(ph); // naive E.164-ish check

//   const simulateNetwork = (ms = 1000) =>
//     new Promise((res) => setTimeout(res, ms));

//   const handleSend = async (e) => {
//     e?.preventDefault();
//     setErrMsg("");
//     setInfoMsg("");
//     // validate input
//     if (method === "email" && !isValidEmail(email)) {
//       setErrMsg("Please enter a valid email address.");
//       return;
//     }
//     if (method === "phone" && !isValidPhone(phone)) {
//       setErrMsg("Please enter a valid phone number (e.g. +9198...).");
//       return;
//     }

//     // simulate send
//     setLoading(true);
//     await simulateNetwork(900);
//     setLoading(false);

//     // show message and move to OTP step
//     setInfoMsg(
//       `A verification code was sent to ${
//         method === "email" ? email : phone
//       }. (dummy)`
//     );
//     setStep("sent");
//     // auto-clear old OTP
//     setOtp(Array(OTP_LENGTH).fill(""));
//   };

//   const handleOtpChange = (index, value) => {
//     if (!/^\d*$/.test(value)) return; // only digits
//     const next = [...otp];
//     next[index] = value.slice(-1);
//     setOtp(next);
//     if (value && index < OTP_LENGTH - 1) {
//       const nextInput = document.getElementById(`otp-${index + 1}`);
//       nextInput?.focus();
//     }
//   };

//   const handleVerify = async (e) => {
//     e?.preventDefault();
//     setErrMsg("");
//     if (otp.some((d) => d === "")) {
//       setErrMsg("Please enter the full verification code.");
//       return;
//     }

//     setLoading(true);
//     await simulateNetwork(700);
//     setLoading(false);

//     // dummy behavior: always accept OTP '123456' as special case; otherwise accept any code
//     // (you can change logic if you want a failing scenario)
//     setInfoMsg("Code verified (dummy). You can now set a new password.");
//     setStep("reset");
//     setNewPassword("");
//     setConfirmPassword("");
//   };

//   const handleReset = async (e) => {
//     e?.preventDefault();
//     setErrMsg("");
//     if (!newPassword || !confirmPassword) {
//       setErrMsg("Both password fields are required.");
//       return;
//     }
//     if (newPassword.length < 8) {
//       setErrMsg("Password must be at least 8 characters.");
//       return;
//     }
//     if (newPassword !== confirmPassword) {
//       setErrMsg("Passwords do not match.");
//       return;
//     }

//     setLoading(true);
//     await simulateNetwork(900);
//     setLoading(false);

//     // success (dummy)
//     setInfoMsg("Password has been reset successfully (dummy).");
//     // you can auto-redirect to login or reset form
//     setTimeout(() => {
//       resetAll();
//       navigate("/login"); // go to login page (your route)
//     }, 900);
//   };

//   const handleResend = async () => {
//     setErrMsg("");
//     setInfoMsg("");
//     setLoading(true);
//     await simulateNetwork(700);
//     setLoading(false);
//     setInfoMsg("A new code has been sent (dummy).");
//     setOtp(Array(OTP_LENGTH).fill(""));
//     document.getElementById("otp-0")?.focus();
//   };

//   // render
//   return (
//     <div className="min-h-screen flex items-center justify-center px-4 py-12">
//       <AnimatePresence mode="wait">
//         {step === "email" && (
//           <SectionWrapper keyProp="email">
//             <div className="text-center mb-4">
//               <h2 className="text-2xl font-semibold text-white">
//                 Forgot Password?
//               </h2>
//               <p className="text-sm text-white/70 mt-2">
//                 Choose a method to receive the reset code.
//               </p>
//             </div>

//             <div className="flex justify-center gap-3 mb-6">
//               <button
//                 onClick={() => setMethod("email")}
//                 className={`px-4 py-2 rounded-lg font-medium ${
//                   method === "email"
//                     ? "bg-indigo-600 text-white"
//                     : "bg-white/10 text-white"
//                 }`}
//               >
//                 Email
//               </button>
//               <button
//                 onClick={() => setMethod("phone")}
//                 className={`px-4 py-2 rounded-lg font-medium ${
//                   method === "phone"
//                     ? "bg-indigo-600 text-white"
//                     : "bg-white/10 text-white"
//                 }`}
//               >
//                 WhatsApp
//               </button>
//             </div>

//             <form onSubmit={handleSend} className="space-y-4">
//               {method === "email" ? (
//                 <div>
//                   <label className="block text-sm text-white/80 mb-2">
//                     Email
//                   </label>
//                   <input
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     placeholder="you@example.com"
//                     className="w-full px-4 py-2 rounded-lg bg-white/5 text-white placeholder-white/50 outline-none border border-white/10"
//                     type="email"
//                   />
//                 </div>
//               ) : (
//                 <div>
//                   <label className="block text-sm text-white/80 mb-2">
//                     WhatsApp Number
//                   </label>
//                   <input
//                     value={phone}
//                     onChange={(e) => setPhone(e.target.value)}
//                     placeholder="+919876543210"
//                     className="w-full px-4 py-2 rounded-lg bg-white/5 text-white placeholder-white/50 outline-none border border-white/10"
//                     type="tel"
//                   />
//                 </div>
//               )}

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full py-2 rounded-lg bg-white text-indigo-700 font-semibold disabled:opacity-60"
//               >
//                 {loading ? "Sending..." : "Send Reset Code"}
//               </button>

//               {errMsg && <p className="text-sm text-red-400 mt-2">{errMsg}</p>}
//               {infoMsg && (
//                 <p className="text-sm text-green-400 mt-2">{infoMsg}</p>
//               )}

//               <div className="mt-4 text-center">
//                 <button
//                   type="button"
//                   onClick={() => navigate("/login")}
//                   className="text-sm text-white/80 hover:underline"
//                 >
//                   Back to Login
//                 </button>
//               </div>
//             </form>
//           </SectionWrapper>
//         )}

//         {step === "sent" && (
//           <SectionWrapper keyProp="sent">
//             <div className="text-center mb-4">
//               <h2 className="text-2xl font-semibold text-white">
//                 Enter Verification Code
//               </h2>
//               <p className="text-sm text-white/70 mt-2">
//                 We sent a 6-digit code to{" "}
//                 <span className="font-medium text-white">
//                   {method === "email" ? email : phone}
//                 </span>
//               </p>
//             </div>

//             <form onSubmit={handleVerify}>
//               <div className="flex justify-center gap-2 mb-4">
//                 {otp.map((d, i) => (
//                   <input
//                     key={i}
//                     id={`otp-${i}`}
//                     value={d}
//                     onChange={(e) => handleOtpChange(i, e.target.value)}
//                     onKeyDown={(e) => {
//                       if (e.key === "Backspace" && !d && i > 0) {
//                         document.getElementById(`otp-${i - 1}`)?.focus();
//                       }
//                       if (e.key === "ArrowLeft" && i > 0) {
//                         document.getElementById(`otp-${i - 1}`)?.focus();
//                       }
//                       if (e.key === "ArrowRight" && i < OTP_LENGTH - 1) {
//                         document.getElementById(`otp-${i + 1}`)?.focus();
//                       }
//                     }}
//                     type="text"
//                     inputMode="numeric"
//                     maxLength={1}
//                     className="w-12 h-12 text-center text-lg font-semibold rounded-lg bg-white/5 text-white placeholder-white/50 outline-none border border-white/10"
//                   />
//                 ))}
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading || otp.some((d) => !d)}
//                 className="w-full py-2 rounded-lg bg-white text-indigo-700 font-semibold disabled:opacity-60"
//               >
//                 {loading ? "Verifying..." : "Verify Code"}
//               </button>

//               <div className="flex items-center justify-between mt-3 text-sm">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setStep("email");
//                     setInfoMsg("");
//                     setErrMsg("");
//                   }}
//                   className="text-white/80 hover:underline"
//                 >
//                   Change method
//                 </button>

//                 <div>
//                   <button
//                     type="button"
//                     onClick={handleResend}
//                     className="text-white/80 hover:underline"
//                   >
//                     Resend
//                   </button>
//                 </div>
//               </div>

//               {errMsg && <p className="text-sm text-red-400 mt-3">{errMsg}</p>}
//               {infoMsg && (
//                 <p className="text-sm text-green-400 mt-3">{infoMsg}</p>
//               )}
//             </form>
//           </SectionWrapper>
//         )}

//         {step === "reset" && (
//           <SectionWrapper keyProp="reset">
//             <div className="text-center mb-4">
//               <h2 className="text-2xl font-semibold text-white">
//                 Set New Password
//               </h2>
//               <p className="text-sm text-white/70 mt-2">
//                 Choose a strong password
//               </p>
//             </div>

//             <form onSubmit={handleReset} className="space-y-3">
//               <div>
//                 <label className="block text-sm text-white/80 mb-2">
//                   New Password
//                 </label>
//                 <input
//                   type="password"
//                   value={newPassword}
//                   onChange={(e) => setNewPassword(e.target.value)}
//                   placeholder="At least 8 characters"
//                   className="w-full px-4 py-2 rounded-lg bg-white/5 text-white outline-none border border-white/10"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm text-white/80 mb-2">
//                   Confirm Password
//                 </label>
//                 <input
//                   type="password"
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   placeholder="Repeat new password"
//                   className="w-full px-4 py-2 rounded-lg bg-white/5 text-white outline-none border border-white/10"
//                 />
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full py-2 rounded-lg bg-white text-indigo-700 font-semibold disabled:opacity-60"
//               >
//                 {loading ? "Resetting..." : "Reset Password"}
//               </button>

//               {errMsg && <p className="text-sm text-red-400 mt-3">{errMsg}</p>}
//               {infoMsg && (
//                 <p className="text-sm text-green-400 mt-3">{infoMsg}</p>
//               )}
//             </form>
//           </SectionWrapper>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// src/pages/ForgotPassword.jsx
// import React, { useState } from "react";
// import { useForgotPasswordMutation } from "@/features/auth/authApi";
// import { useNavigate } from "react-router-dom";

// export default function ForgotPassword() {
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setError("");

//     if (!email) return setError("Email is required.");

//     try {
//       const res = await forgotPassword(email).unwrap();
//       setMessage(res.message || "If that email exists, a reset link was sent.");
//     } catch (err) {
//       setError(err?.data?.message || "Something went wrong.");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center px-4">
//       <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 w-full max-w-md">
//         <h2 className="text-2xl font-semibold text-white text-center mb-6">
//           Forgot Password
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm text-white/80 mb-2">Email</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="you@example.com"
//               className="w-full px-4 py-2 rounded-lg bg-white/5 text-white outline-none border border-white/10"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full py-2 rounded-lg bg-white text-indigo-700 font-semibold disabled:opacity-60"
//           >
//             {isLoading ? "Sending..." : "Send Reset Link"}
//           </button>

//           {error && <p className="text-red-400 text-sm">{error}</p>}
//           {message && <p className="text-green-400 text-sm">{message}</p>}

//           <div className="mt-4 text-center">
//             <button
//               type="button"
//               onClick={() => navigate("/login")}
//               className="text-sm text-white/80 hover:underline"
//             >
//               Back to Login
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import { useForgotPasswordMutation } from "@/features/auth/authApi";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
// import toast, { Toaster } from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) return toast.error("Email is required.");

    try {
      const res = await forgotPassword(email).unwrap();
      toast.success(
        res.message || "If that email exists, a reset link was sent."
      );
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong.");
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
          Forgot Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="block text-sm text-white/80 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
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
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </motion.button>

          <div className="mt-4 text-center">
            <motion.button
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={() => navigate("/login")}
              className="text-sm text-white/80 hover:underline"
            >
              Back to Login
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
