import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/auth/login", { email, password });
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      toast.success("Logged in successfully!");
      navigate("/upload");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: "#f3f4f6", color: "#111827" }}>
      {/* Gradient blobs for background */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>

      {/* Top bar with logo and link to Register */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="text-2xl font-bold" style={{ background: "linear-gradient(90deg,#2563eb,#1e3a8a)", WebkitBackgroundClip: "text", color: "transparent" }}>MatchCV</div>
        <div className="flex gap-3 items-center">
          <button
            onClick={() => navigate("/register")}
            className="px-4 py-2 rounded-md text-white shadow"
            style={{ background: "linear-gradient(90deg,#2563eb,#1e3a8a)" }}
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Centered form card */}
      <div className="relative z-10 max-w-7xl m-50 mx-auto px-6 py-8">
        <div className="mx-auto w-full max-w-lg backdrop-blur-sm rounded-2xl shadow" style={{ background: "#ffffff", border: "1px solid #e5e7eb" }}>
          <div className="px-8 py-8">
            <h2 className="text-3xl font-bold text-center mb-2" style={{ color: "#111827" }}>Welcome Back</h2>
            <p className="text-center mb-6" style={{ color: "#6b7280" }}>Log in to continue</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
                style={{ borderColor: "#e5e7eb", boxShadow: "none", background: "#ffffff", color: "#111827" }}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
                style={{ borderColor: "#e5e7eb", boxShadow: "none", background: "#ffffff", color: "#111827" }}
              />

              <button
                type="submit"
                className="w-full text-white py-3 rounded-lg font-semibold shadow"
                style={{ background: "linear-gradient(90deg,#2563eb,#1e3a8a)" }}
              >
                Login
              </button>
            </form>

            <p className="mt-6 text-center" style={{ color: "#6b7280" }}>
              Don't have an account?{" "}
              <span
                className="cursor-pointer"
                style={{ color: "#2563eb" }}
                onClick={() => navigate("/register")}
              >
                Register
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
