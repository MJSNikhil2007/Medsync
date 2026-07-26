import React from "react";

const DashboardCard = ({ title, value, subtitle, icon, onClick, hoverEffect = true, className = "" }) => {
  return (
    <div
      onClick={onClick}
      className={`glass-panel p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${
        onClick ? "cursor-pointer" : ""
      } ${
        hoverEffect ? "hover:-translate-y-1 hover:border-slate-700 hover:shadow-glass-cyan" : ""
      } ${className}`}
    >
      {/* Decorative radial background glow */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-brand-accent bg-opacity-[0.03] rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex justify-between items-start gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
          <span className="text-2xl font-extrabold text-white tracking-tight mt-1">{value}</span>
        </div>
        {icon && (
          <div className="p-3 rounded-xl bg-slate-800 bg-opacity-40 border border-brand-border text-brand-accent">
            {icon}
          </div>
        )}
      </div>

      {subtitle && (
        <div className="mt-4 text-xs font-medium text-slate-400 flex items-center gap-1 border-t border-brand-border border-opacity-40 pt-3">
          {subtitle}
        </div>
      )}
    </div>
  );
};

export default DashboardCard;
