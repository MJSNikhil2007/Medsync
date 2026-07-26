import React, { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, Mail, Lock, User, AlertCircle, ArrowRight } from "lucide-react";

const Register = () => {
  const { register, user } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setError("");
    setLoading(true);

    const result = await register(email, password, fullName);
    setLoading(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
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
          <div className="p-3 rounded-2xl bg-brand-accent bg-opacity-10 border border-brand-accent border-opacity-20 glow-cyan">
            <Eye className="w-8 h-8 text-brand-accent" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Create Account</h2>
          <p className="text-slate-400 text-sm">Join MediVision AI and audit your health analytics</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 mb-6 text-sm text-brand-danger bg-brand-danger bg-opacity-10 border border-brand-danger border-opacity-20 p-4 rounded-xl">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex flex-col gap-1 mb-6 text-sm text-brand-highlight bg-brand-highlight bg-opacity-10 border border-brand-highlight border-opacity-20 p-4 rounded-xl">
            <p className="font-bold">Account Created Successfully!</p>
            <p className="text-xs text-slate-300">Redirecting to sign in...</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Dr. Alex Carter"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-12 pr-4 py-3 glass-input"
                required
              />
            </div>
          </div>

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
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 glass-input"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-brand-accent to-brand-highlight hover:from-brand-accent hover:to-brand-highlight text-white font-bold rounded-xl transition-all duration-300 shadow-glass-cyan hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-50 disabled:scale-100"
          >
            {loading ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            ) : (
              <>
                <span>Sign Up</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-8">
          Already have an account?{" "}
          <Link to="/login" className="text-brand-highlight hover:underline font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
