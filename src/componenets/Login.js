import React from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";

const Login = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const response = await fetch("http://localhost:4000/auth/google", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch Google login URL");
      }

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Google Login Error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-md w-full p-8 bg-gray-900 text-white shadow-2xl rounded-2xl">
          <div className="flex flex-col items-center gap-6">
            <h1 className="text-3xl font-bold mb-4 text-center text-yellow-400">
              Welcome to Smart Mails
            </h1>
            <p className="text-gray-400 text-center mb-6">
              Sign in to continue with your Google account.
            </p>
            <button
              onClick={handleGoogleLogin}
              className="flex items-center gap-3 bg-white text-black hover:bg-gray-200 px-6 py-3 rounded-xl shadow-md"
            >
              <FcGoogle size={24} />
              <span className="font-medium">Login with Google</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
