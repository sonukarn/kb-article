import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useVerifyEmailQuery } from "@/features/auth/authApi";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const id = searchParams.get("id");
  const navigate = useNavigate();

  // call RTK Query, but skip until token+id present
  const { data, error, isLoading, isSuccess } = useVerifyEmailQuery(
    { token, id },
    { skip: !token || !id }
  );

  useEffect(() => {
    if (!token || !id) return;
    if (isSuccess) {
      // show success then redirect to login
      setTimeout(() => navigate("/login"), 900);
    }
  }, [isSuccess, token, id, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-3xl p-8 text-center border border-white/20 shadow-lg"
      >
        {isLoading && (
          <>
            <div className="mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mx-auto">
                <svg
                  className="w-8 h-8 text-white animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="white"
                    strokeWidth="2"
                    strokeOpacity="0.2"
                  />
                  <path
                    d="M22 12a10 10 0 00-10-10"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-orange-700 mb-2">
              Verifying…
            </h3>
            <p className="text-gray-700 text-md">
              Please wait while we verify your email.
            </p>
          </>
        )}

        {isSuccess && (
          <>
            <h3 className="text-2xl font-semibold text-white mb-2">
              Verified!
            </h3>
            <p className="text-white/80">
              {data?.message || "Email verified successfully."}
            </p>
          </>
        )}

        {error && (
          <>
            <h3 className="text-2xl font-semibold text-white mb-2">
              Verification failed
            </h3>
            <p className="text-white/80 mb-4">
              {error?.data?.message || "Verification failed or link expired."}
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => navigate("/verify-email-sent")}
                className="px-4 py-2 rounded-lg bg-white text-indigo-600"
              >
                Resend email
              </button>
              <button
                onClick={() => navigate("/")}
                className="px-4 py-2 rounded-lg border border-white/20 text-white"
              >
                Back home
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
