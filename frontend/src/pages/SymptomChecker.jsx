import React, { useState } from "react";
import API from "../services/api";
import { 
  Stethoscope, 
  Activity, 
  Clock, 
  AlertTriangle, 
  Info,
  RefreshCw,
  AlertCircle,
  ShieldAlert,
  ChevronRight
} from "lucide-react";

const SYMPTOMS_LIST = [
  { id: "fever", name: "Fever / Chills" },
  { id: "cough", name: "Cough / Congestion" },
  { id: "chest_pain", name: "Chest Pain / Heart tightness" },
  { id: "shortness_breath", name: "Shortness of Breath" },
  { id: "headache", name: "Headache / Migraine" },
  { id: "sore_throat", name: "Sore Throat" },
  { id: "stomach_pain", name: "Stomach Pain / Nausea / Diarrhea" },
  { id: "stiff_neck", name: "Stiff Neck" },
  { id: "dizziness", name: "Dizziness / Lightheadedness" },
  { id: "joint_pain", name: "Joint Pain / Stiffness" },
  { id: "fatigue", name: "Severe Fatigue / Weakness" },
  { id: "urinary", name: "Frequent or Painful Urination" }
];

const SymptomChecker = () => {
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState("Male");
  const [duration, setDuration] = useState(1);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [notes, setNotes] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSymptomToggle = (id) => {
    if (selectedSymptoms.includes(id)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== id));
    } else {
      setSelectedSymptoms([...selectedSymptoms, id]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedSymptoms.length === 0) {
      setError("Please select at least one symptom.");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    // Map checked IDs to display names for API request
    const symptomNames = selectedSymptoms.map(
      (id) => SYMPTOMS_LIST.find((s) => s.id === id).name
    );

    try {
      const res = await API.post("/api/symptoms/analyze", {
        symptoms: symptomNames,
        duration_days: duration,
        age: age,
        gender: gender,
        additional_notes: notes || null
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError("Analysis failed. Please verify the backend API status.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedSymptoms([]);
    setDuration(1);
    setNotes("");
    setResult(null);
    setError("");
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case "Critical":
        return "text-brand-danger border-brand-danger bg-brand-danger bg-opacity-10";
      case "High":
        return "text-brand-warning border-brand-warning bg-brand-warning bg-opacity-10";
      case "Medium":
        return "text-indigo-400 border-indigo-400 bg-indigo-400 bg-opacity-10";
      default:
        return "text-brand-highlight border-brand-highlight bg-brand-highlight bg-opacity-10";
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <Stethoscope className="w-8 h-8 text-brand-highlight glow-emerald" />
          AI Symptom Checker
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Select your symptoms and context parameters to receive heuristic medical warnings.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs text-brand-danger bg-brand-danger bg-opacity-10 border border-brand-danger border-opacity-20 p-4 rounded-xl">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Column: Form (Width: 3/5 on large) */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <form onSubmit={handleSubmit} className="glass-panel p-6 md:p-8 flex flex-col gap-6">
            <h3 className="text-base font-bold text-white border-b border-brand-border border-opacity-40 pb-3">
              Patient Context & Metrics
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Age */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Patient Age</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value) || 30)}
                  className="w-full py-3 px-4 glass-input text-center font-bold text-lg"
                  required
                />
              </div>

              {/* Gender */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Biological Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full py-3 px-4 glass-input font-medium"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Duration */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Duration (Days)</label>
                <input
                  type="number"
                  min="1"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
                  className="w-full py-3 px-4 glass-input text-center font-bold text-lg"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Select Symptoms</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SYMPTOMS_LIST.map((s) => {
                  const checked = selectedSymptoms.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleSymptomToggle(s.id)}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border text-left text-xs font-semibold transition-all duration-300 ${
                        checked
                          ? "bg-brand-highlight bg-opacity-10 border-brand-highlight border-opacity-40 text-white shadow-glass-emerald"
                          : "bg-brand-card bg-opacity-30 border-brand-border text-slate-400 hover:text-slate-200 hover:border-slate-700"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                        checked 
                          ? "bg-brand-highlight border-brand-highlight text-brand-dark" 
                          : "border-slate-600"
                      }`}>
                        {checked && <div className="w-1.5 h-1.5 bg-brand-dark rounded-sm"></div>}
                      </div>
                      <span>{s.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Additional Notes (Optional)</label>
              <textarea
                rows="3"
                placeholder="Describe any other triggers, severity variations, or patterns you notice..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full py-3 px-4 glass-input text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-brand-highlight to-brand-accent text-white font-bold rounded-xl text-sm transition-all duration-300 shadow-glass-emerald hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-50 disabled:scale-100"
            >
              {loading ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              ) : (
                <>
                  <Activity className="w-4 h-4" />
                  <span>Analyze Symptoms</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Diagnostic Result (Width: 2/5 on large) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {result ? (
            <div className="glass-panel p-6 md:p-8 flex flex-col gap-6 relative overflow-hidden animate-fade-in">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-brand-highlight bg-opacity-[0.03] rounded-full blur-2xl pointer-events-none"></div>

              <div className="flex items-center justify-between border-b border-brand-border border-opacity-40 pb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Info className="w-5 h-5 text-brand-accent" />
                  AI Clinical Audit
                </h3>
                <button
                  onClick={resetForm}
                  className="p-2 rounded-lg bg-slate-800 bg-opacity-40 hover:bg-slate-700 text-slate-400 hover:text-white border border-brand-border transition-colors duration-300"
                  title="Reset Audit"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {/* Suspended Diagnosis */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Suspected Diagnosis</span>
                <p className="text-xl font-extrabold text-white mt-1 leading-snug">
                  {result.diagnosis}
                </p>
              </div>

              {/* Severity & Action Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-800 bg-opacity-35 border border-brand-border rounded-xl flex flex-col gap-1">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Severity Warning</span>
                  <span className={`mt-1 font-bold text-xs uppercase tracking-wider px-2 py-0.5 rounded border inline-block text-center w-fit ${getSeverityBadge(result.severity)}`}>
                    {result.severity}
                  </span>
                </div>
                <div className="p-4 bg-slate-800 bg-opacity-35 border border-brand-border rounded-xl flex flex-col gap-1">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Urgency Code</span>
                  <span className="mt-1.5 font-bold text-white text-xs truncate">
                    {result.additional_info?.urgency_level || "Routine"}
                  </span>
                </div>
              </div>

              {/* Possible Causes */}
              {result.additional_info?.possible_causes && (
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Possible Pathologies</span>
                  <div className="flex flex-wrap gap-1.5">
                    {result.additional_info.possible_causes.map((c, i) => (
                      <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 border border-brand-border text-slate-200">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              <div className="flex flex-col gap-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Action Plan</span>
                <ul className="flex flex-col gap-2.5">
                  {result.recommendations.map((rec, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-2.5 leading-relaxed bg-brand-dark bg-opacity-40 p-3 rounded-xl border border-brand-border border-opacity-30">
                      <ChevronRight className="w-4 h-4 text-brand-highlight shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Disclaimer */}
              <div className="flex gap-2.5 p-3 rounded-xl bg-brand-danger bg-opacity-5 border border-brand-danger border-opacity-10 text-[10px] text-slate-500 leading-normal">
                <ShieldAlert className="w-5 h-5 text-brand-danger shrink-0 mt-0.5 opacity-70" />
                <p>
                  <strong>Disclaimer:</strong> This system uses a rule-based diagnostic analysis engine and is for educational demonstration and screening support only. It does not replace professional clinical evaluation.
                </p>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-10 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
              <div className="p-4 bg-slate-800 bg-opacity-40 rounded-full border border-brand-border text-slate-600 mb-4 glow-cyan">
                <Stethoscope className="w-10 h-10 text-slate-500" />
              </div>
              <p className="text-slate-200 font-semibold text-base">Awaiting Diagnostic Audit</p>
              <p className="text-slate-500 text-xs mt-1.5 max-w-[240px] leading-relaxed">
                Check symptoms, fill in age/duration variables, and click Analyze to view diagnostic findings.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker;
