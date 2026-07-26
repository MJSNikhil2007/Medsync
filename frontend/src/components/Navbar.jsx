import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  LayoutDashboard, 
  Stethoscope, 
  FileText, 
  Activity, 
  User, 
  LogOut, 
  Menu, 
  X,
  Eye
} from "lucide-react";

const Navbar = () => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Symptom Checker", path: "/symptoms", icon: Stethoscope },
    { name: "Report Analyzer", path: "/reports", icon: FileText },
    { name: "Health Score", path: "/health-score", icon: Activity },
    { name: "Profile", path: "/profile", icon: User },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Header */}
      <header className="flex md:hidden items-center justify-between px-6 py-4 bg-brand-card bg-opacity-90 border-b border-brand-border sticky top-0 z-40 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-2">
          <Eye className="w-6 h-6 text-brand-highlight glow-emerald" />
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-brand-highlight to-brand-accent bg-clip-text text-transparent">
            MediVision AI
          </span>
        </Link>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="text-slate-300 hover:text-white focus:outline-none"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 h-screen fixed top-0 left-0 bg-brand-card bg-opacity-40 border-r border-brand-border py-8 px-6 justify-between backdrop-blur-lg z-35">
        <div className="flex flex-col gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 px-2">
            <div className="p-2 rounded-xl bg-brand-highlight bg-opacity-10 border border-brand-highlight border-opacity-20 glow-emerald">
              <Eye className="w-6 h-6 text-brand-highlight" />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-brand-highlight to-brand-accent bg-clip-text text-transparent">
              MediVision AI
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2 mt-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                    active 
                      ? "bg-gradient-to-r from-brand-highlight from-10% to-brand-accent bg-opacity-20 text-white font-medium shadow-glass-emerald border border-brand-highlight border-opacity-30" 
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800 hover:bg-opacity-40 border border-transparent"
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${active ? "text-brand-highlight" : "text-slate-400 group-hover:text-brand-highlight"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="flex flex-col gap-4 border-t border-brand-border pt-6">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-brand-accent bg-opacity-10 border border-brand-accent border-opacity-30 flex items-center justify-center text-brand-accent font-bold">
              {user?.full_name?.charAt(0) || "U"}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold text-slate-200 truncate">{user?.full_name}</span>
              <span className="text-xs text-slate-400 truncate">{user?.email}</span>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-brand-danger rounded-xl hover:bg-brand-danger hover:bg-opacity-10 border border-transparent hover:border-brand-danger hover:border-opacity-25 transition-all duration-300 w-full"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Drawer (Mobile) */}
      <div className={`md:hidden fixed inset-0 z-50 bg-brand-dark bg-opacity-90 backdrop-blur-md transition-all duration-300 flex flex-col justify-between py-8 px-6 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
              <Eye className="w-6 h-6 text-brand-highlight glow-emerald" />
              <span className="font-extrabold text-xl bg-gradient-to-r from-brand-highlight to-brand-accent bg-clip-text text-transparent">
                MediVision AI
              </span>
            </Link>
            <button onClick={() => setIsOpen(false)} className="text-slate-300 focus:outline-none">
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex flex-col gap-3 mt-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl border transition-all duration-300 ${
                    active 
                      ? "bg-gradient-to-r from-brand-highlight to-brand-accent text-white font-medium border-brand-highlight border-opacity-35" 
                      : "text-slate-400 border-transparent hover:text-slate-100 hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex flex-col gap-4 border-t border-brand-border pt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-accent bg-opacity-20 border border-brand-accent border-opacity-40 flex items-center justify-center text-brand-accent font-bold">
              {user?.full_name?.charAt(0) || "U"}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-200">{user?.full_name}</span>
              <span className="text-xs text-slate-400">{user?.email}</span>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-brand-danger rounded-xl hover:bg-brand-danger hover:bg-opacity-10 border border-transparent transition-all duration-300 w-full"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
