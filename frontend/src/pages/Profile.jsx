import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import { 
  User, 
  Mail, 
  Calendar, 
  Activity, 
  Stethoscope, 
  FileText, 
  Clock, 
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Trash2
} from "lucide-react";

const Profile = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("scores");
  const [scoresHistory, setScoresHistory] = useState([]);
  const [symptomsHistory, setSymptomsHistory] = useState([]);
  const [reportsHistory, setReportsHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const [scoresRes, symptomsRes, reportsRes] = await Promise.all([
          API.get("/api/health-score/history"),
          API.get("/api/symptoms/history"),
          API.get("/api/reports/history")
        ]);
        setScoresHistory(scoresRes.data);
        setSymptomsHistory(symptomsRes.data);
        setReportsHistory(reportsRes.data);
      } catch (err) {
        console.error("Error loading user history:", err);
        setError("Could not retrieve user clinical logs.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString([], {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSeverityColor = (sev) => {
    switch (sev) {
      case "Critical": return "text-brand-danger bg-brand-danger bg-opacity-10 border border-brand-danger border-opacity-20";
      case "High": return "text-brand-warning bg-brand-warning bg-opacity-10 border border-brand-warning border-opacity-20";
      case "Medium": return "text-indigo-400 bg-indigo-400 bg-opacity-10 border border-indigo-400 border-opacity-20";
      default: return "text-brand-highlight bg-brand-highlight bg-opacity-10 border border-brand-highlight border-opacity-20";
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header Profile Info Card */}
      <div className="glass-panel p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-accent bg-opacity-[0.03] rounded-full blur-2xl"></div>
        
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-brand-highlight to-brand-accent flex items-center justify-center text-white font-extrabold text-2xl shadow-glass-emerald">
            {user?.full_name?.charAt(0) || "U"}
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">{user?.full_name}</h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1.5 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                {user?.email}
              </span>
              <span className="hidden sm:inline text-slate-700">•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Joined {new Date(user?.created_at).toLocaleDateString([], { month: "short", year: "numeric" })}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="py-2.5 px-4 bg-brand-danger bg-opacity-10 hover:bg-opacity-25 text-brand-danger border border-brand-danger border-opacity-20 font-bold rounded-xl text-xs transition-all duration-300 shadow-glass"
        >
          Sign Out Account
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs text-brand-danger bg-brand-danger bg-opacity-10 border border-brand-danger border-opacity-20 p-4 rounded-xl">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tabs list & Logs Panel */}
      <div className="flex flex-col gap-6">
        {/* Navigation Tabs */}
        <div className="flex border-b border-brand-border border-opacity-40">
          <button
            onClick={() => setActiveTab("scores")}
            className={`flex items-center gap-2 px-6 py-3 border-b-2 font-bold text-sm transition-all duration-300 ${
              activeTab === "scores"
                ? "border-brand-highlight text-white"
                : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Health Scores ({scoresHistory.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("symptoms")}
            className={`flex items-center gap-2 px-6 py-3 border-b-2 font-bold text-sm transition-all duration-300 ${
              activeTab === "symptoms"
                ? "border-brand-highlight text-white"
                : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>Symptom Checks ({symptomsHistory.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`flex items-center gap-2 px-6 py-3 border-b-2 font-bold text-sm transition-all duration-300 ${
              activeTab === "reports"
                ? "border-brand-highlight text-white"
                : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Lab Reports ({reportsHistory.length})</span>
          </button>
        </div>

        {/* Tab Contents */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-brand-highlight border-brand-border"></div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 animate-fade-in">
            {/* Scores History */}
            {activeTab === "scores" && (
              scoresHistory.length > 0 ? (
                scoresHistory.map((log) => (
                  <div key={log.id} className="glass-panel p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-brand-border">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-slate-800 bg-opacity-40 border border-brand-border rounded-xl flex items-center justify-center text-brand-highlight">
                        <Activity className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-extrabold text-white">Score: {log.score}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                            log.score >= 85 ? "text-brand-highlight border-brand-highlight border-opacity-20" : log.score >= 70 ? "text-brand-accent border-brand-accent border-opacity-20" : "text-brand-warning border-brand-warning border-opacity-20"
                          }`}>
                            {log.status}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400">
                          BMI: {log.bmi} • Sleep: {log.sleep_hours}h • Exercise: {log.exercise_mins}m • Water: {log.water_ml}ml • BP: {log.systolic_bp}/{log.diastolic_bp}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                      <Clock className="w-4 h-4 text-slate-600" />
                      <span>{formatDate(log.created_at)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 glass-panel">
                  <p className="text-slate-500 text-sm">No health score logs available yet.</p>
                </div>
              )
            )}

            {/* Symptoms History */}
            {activeTab === "symptoms" && (
              symptomsHistory.length > 0 ? (
                symptomsHistory.map((log) => (
                  <div key={log.id} className="glass-panel p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-brand-border">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-slate-800 bg-opacity-40 border border-brand-border rounded-xl flex items-center justify-center text-indigo-400">
                        <Stethoscope className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-white leading-none">{log.diagnosis}</span>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${getSeverityColor(log.severity)}`}>
                            {log.severity}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 line-clamp-1 mt-1">
                          Audited Symptoms: {log.symptoms} (Duration: {log.duration_days} days)
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                      <Clock className="w-4 h-4 text-slate-600" />
                      <span>{formatDate(log.created_at)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 glass-panel">
                  <p className="text-slate-500 text-sm">No symptom audit logs available yet.</p>
                </div>
              )
            )}

            {/* Reports History */}
            {activeTab === "reports" && (
              reportsHistory.length > 0 ? (
                reportsHistory.map((log) => (
                  <div key={log.id} className="glass-panel p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-brand-border">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-slate-800 bg-opacity-40 border border-brand-border rounded-xl flex items-center justify-center text-brand-accent">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold text-white leading-none truncate max-w-[250px]">{log.file_name}</span>
                        <p className="text-xs text-slate-400 line-clamp-1 mt-1">
                          Summary: {log.summary}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                      <Clock className="w-4 h-4 text-slate-600" />
                      <span>{formatDate(log.created_at)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 glass-panel">
                  <p className="text-slate-500 text-sm">No medical report logs available yet.</p>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
