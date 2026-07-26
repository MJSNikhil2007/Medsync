import React, { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, Mail, Lock, AlertCircle, ArrowRight } from "lucide-react";

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setError("");
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate("/");
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-brand-highlight bg-opacity-[0.03] rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-brand-accent bg-opacity-[0.03] rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }}></div>

      <div className="w-full max-w-md glass-panel p-8 md:p-10 relative overflow-hidden">
        <div className="flex flex-col items-center gap-3 text-center mb-8">
          <div className="p-3 rounded-2xl bg-brand-highlight bg-opacity-10 border border-brand-highlight border-opacity-20 glow-emerald">
            <Eye className="w-8 h-8 text-brand-highlight" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Welcome Back</h2>
          <p className="text-slate-400 text-sm">Sign in to access your MediVision AI account</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 mb-6 text-sm text-brand-danger bg-brand-danger bg-opacity-10 border border-brand-danger border-opacity-20 p-4 rounded-xl">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 glass-input"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 glass-input"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-brand-highlight to-brand-accent hover:from-brand-highlight hover:to-brand-accent text-white font-bold rounded-xl transition-all duration-300 shadow-glass-emerald hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-50 disabled:scale-100"
          >
            {loading ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-8">
          Don't have an account?{" "}
          <Link to="/register" className="text-brand-highlight hover:underline font-semibold">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
