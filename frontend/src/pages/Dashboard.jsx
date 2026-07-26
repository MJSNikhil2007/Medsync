import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import DashboardCard from "../components/DashboardCard";
import CustomChart from "../components/CustomChart";
import { 
  Heart, 
  Activity, 
  Moon, 
  Droplet, 
  Scale, 
  Stethoscope, 
  Upload, 
  ArrowRight,
  TrendingUp,
  AlertCircle
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [healthHistory, setHealthHistory] = useState([]);
  const [symptomHistory, setSymptomHistory] = useState([]);
  const [reportHistory, setReportHistory] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [scoresRes, symptomsRes, reportsRes] = await Promise.all([
          API.get("/api/health-score/history"),
          API.get("/api/symptoms/history"),
          API.get("/api/reports/history")
        ]);
        setHealthHistory(scoresRes.data);
        setSymptomHistory(symptomsRes.data);
        setReportHistory(reportsRes.data);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setError("Could not load dashboard data. Is the backend server running?");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const latestScore = healthHistory[0] || null;
  const healthScoreVal = latestScore ? latestScore.score : 0;
  
  // Format history for chart
  const reversedHistory = [...healthHistory].reverse();
  const chartPoints = reversedHistory.map(item => item.score);
  const chartLabels = reversedHistory.map(item => 
    new Date(item.created_at).toLocaleDateString([], { month: "short", day: "numeric" })
  );

  // Status mapping
  const getScoreColor = (score) => {
    if (score >= 85) return "text-brand-highlight border-brand-highlight border-opacity-30 shadow-glass-emerald";
    if (score >= 70) return "text-brand-accent border-brand-accent border-opacity-30 shadow-glass-cyan";
    if (score >= 50) return "text-brand-warning border-brand-warning border-opacity-30";
    return "text-brand-danger border-brand-danger border-opacity-30";
  };

  const getScoreBg = (score) => {
    if (score >= 85) return "from-brand-highlight to-emerald-400";
    if (score >= 70) return "from-brand-accent to-cyan-400";
    if (score >= 50) return "from-brand-warning to-yellow-400";
    return "from-brand-danger to-red-400";
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-t-brand-highlight border-brand-border"></div>
          <p className="text-slate-400 text-sm">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Hello, {user?.full_name}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Here's a summary of your AI wellness insights and health score trends.
          </p>
        </div>

        <Link
          to="/health-score"
          className="flex items-center justify-center gap-2 py-3 px-5 bg-gradient-to-r from-brand-highlight to-brand-accent text-white font-bold rounded-xl text-sm transition-all duration-300 shadow-glass-emerald hover:scale-[1.01]"
        >
          <span>Calculate Health Score</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs text-brand-danger bg-brand-danger bg-opacity-10 border border-brand-danger border-opacity-20 p-4 rounded-xl">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Health Score Circular Gauge */}
        <div className="glass-panel p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-brand-highlight bg-opacity-[0.02] rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-brand-accent bg-opacity-[0.02] rounded-full blur-3xl pointer-events-none"></div>

          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6">
            Overall Health Score
          </h3>

          {latestScore ? (
            <div className="flex flex-col items-center justify-center">
              {/* Circular Ring */}
              <div className="relative flex items-center justify-center w-40 h-40">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Track */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-brand-border fill-transparent"
                    strokeWidth="8"
                  />
                  {/* Indicator */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="fill-transparent transition-all duration-1000 ease-out"
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - healthScoreVal / 100)}
                    strokeLinecap="round"
                    stroke={`url(#scoreGradient)`}
                  />
                  <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
                {/* Center text */}
                <div className="absolute flex flex-col items-center">
                  <span className="text-4xl font-extrabold text-white">{healthScoreVal}</span>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Rating</span>
                </div>
              </div>

              <div className={`mt-6 px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider ${getScoreColor(healthScoreVal)}`}>
                {latestScore.status}
              </div>

              <p className="text-xs text-slate-400 mt-4 max-w-[220px]">
                Analyzed on {new Date(latestScore.created_at).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6">
              <div className="p-4 bg-brand-border bg-opacity-30 rounded-full text-slate-500 mb-4">
                <Activity className="w-10 h-10" />
              </div>
              <p className="text-slate-300 font-semibold text-sm">No Health Audit Data</p>
              <p className="text-slate-500 text-xs mt-1 max-w-[200px] leading-relaxed">
                Add your lifestyle details to generate your first rule-based score.
              </p>
              <Link
                to="/health-score"
                className="mt-6 py-2 px-4 bg-slate-800 hover:bg-slate-700 text-white border border-brand-border rounded-xl text-xs font-semibold transition-colors duration-300"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Right Columns: Trend Chart */}
        <div className="glass-panel p-6 lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-brand-border border-opacity-40 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-highlight" />
              <h3 className="text-base font-bold text-white">Score Tracking Trends</h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">History Logs</span>
          </div>

          <div className="flex-1 min-h-[220px] flex items-center justify-center">
            {healthHistory.length > 0 ? (
              <CustomChart dataPoints={chartPoints} labels={chartLabels} label="Health Score" type="line" height={220} />
            ) : (
              <div className="text-center">
                <p className="text-slate-500 text-sm">History logs will show once you calculate multiple scores.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      {latestScore && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <DashboardCard
            title="Blood Pressure"
            value={`${latestScore.systolic_bp}/${latestScore.diastolic_bp}`}
            subtitle="mmHg"
            icon={<Heart className="w-5 h-5 text-brand-danger" />}
            hoverEffect={false}
          />
          <DashboardCard
            title="Heart Rate"
            value={`${latestScore.heart_rate}`}
            subtitle="bpm"
            icon={<Activity className="w-5 h-5 text-brand-warning" />}
            hoverEffect={false}
          />
          <DashboardCard
            title="Sleep Time"
            value={`${latestScore.sleep_hours}`}
            subtitle="hours"
            icon={<Moon className="w-5 h-5 text-indigo-400" />}
            hoverEffect={false}
          />
          <DashboardCard
            title="Water Hydration"
            value={`${latestScore.water_ml}`}
            subtitle="ml"
            icon={<Droplet className="w-5 h-5 text-brand-accent" />}
            hoverEffect={false}
          />
          <DashboardCard
            title="Current BMI"
            value={`${latestScore.bmi}`}
            subtitle="index"
            icon={<Scale className="w-5 h-5 text-brand-highlight" />}
            hoverEffect={false}
          />
        </div>
      )}

      {/* Action Checkups & Diagnostic History Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* AI Symptom Quick Log */}
        <div className="glass-panel p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-brand-border border-opacity-40 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-brand-highlight glow-emerald" />
              <h3 className="text-base font-bold text-white">Symptom Checker</h3>
            </div>
            <Link to="/symptoms" className="text-xs text-brand-highlight hover:underline font-semibold flex items-center gap-1">
              <span>Audit Now</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="flex-1 flex flex-col gap-4 mt-2 justify-center">
            {symptomHistory.length > 0 ? (
              <div className="flex flex-col gap-4">
                <div className="p-4 bg-slate-800 bg-opacity-30 border border-brand-border rounded-xl">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-xs font-bold text-slate-400">Suspected Condition</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                      symptomHistory[0].severity === "Critical" 
                        ? "text-brand-danger border-brand-danger border-opacity-20 bg-brand-danger bg-opacity-10"
                        : symptomHistory[0].severity === "High"
                        ? "text-brand-warning border-brand-warning border-opacity-20 bg-brand-warning bg-opacity-10"
                        : "text-brand-highlight border-brand-highlight border-opacity-20 bg-brand-highlight bg-opacity-10"
                    }`}>
                      {symptomHistory[0].severity}
                    </span>
                  </div>
                  <p className="text-base font-bold text-white mt-1">{symptomHistory[0].diagnosis}</p>
                  <p className="text-xs text-slate-400 mt-2 truncate">Symptoms: {symptomHistory[0].symptoms}</p>
                </div>
                <div className="text-xs text-slate-500">
                  Last evaluated: {new Date(symptomHistory[0].created_at).toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-slate-500 text-sm">No symptoms scanned recently.</p>
                <Link to="/symptoms" className="text-xs text-brand-highlight hover:underline mt-2 inline-block font-semibold">
                  Launch Symptom Scan
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* AI Reports Upload History */}
        <div className="glass-panel p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-brand-border border-opacity-40 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-brand-accent glow-cyan" />
              <h3 className="text-base font-bold text-white">Medical Report Lab</h3>
            </div>
            <Link to="/reports" className="text-xs text-brand-accent hover:underline font-semibold flex items-center gap-1">
              <span>Upload PDF</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="flex-1 flex flex-col gap-4 mt-2 justify-center">
            {reportHistory.length > 0 ? (
              <div className="flex flex-col gap-4">
                <div className="p-4 bg-slate-800 bg-opacity-30 border border-brand-border rounded-xl">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-xs font-bold text-slate-400 truncate max-w-[200px]">{reportHistory[0].file_name}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Analyzed</span>
                  </div>
                  <p className="text-xs text-slate-200 mt-2 font-medium leading-relaxed line-clamp-2">
                    {reportHistory[0].summary}
                  </p>
                  <p className="text-xs text-brand-accent font-semibold mt-2">
                    Metrics Extracted: {reportHistory[0].metrics.length} Parameters
                  </p>
                </div>
                <div className="text-xs text-slate-500">
                  Last uploaded: {new Date(reportHistory[0].created_at).toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-slate-500 text-sm">No report uploads analyzed recently.</p>
                <Link to="/reports" className="text-xs text-brand-accent hover:underline mt-2 inline-block font-semibold">
                  Launch OCR Scanner
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
