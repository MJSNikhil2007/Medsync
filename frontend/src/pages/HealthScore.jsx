import React, { useState } from "react";
import API from "../services/api";
import { 
  Activity, 
  Moon, 
  Droplet, 
  Heart, 
  Scale, 
  Trash2,
  RefreshCw, 
  CheckCircle,
  AlertCircle,
  HelpCircle
} from "lucide-react";

const HealthScore = () => {
  // Inputs
  const [sleep, setSleep] = useState(7.5);
  const [exercise, setExercise] = useState(30);
  const [water, setWater] = useState(2000);
  const [systolic, setSystolic] = useState(120);
  const [diastolic, setDiastolic] = useState(80);
  const [heartRate, setHeartRate] = useState(70);
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(175);
  const [diet, setDiet] = useState("Good");
  const [smokeAlcohol, setSmokeAlcohol] = useState("None");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setResult(null);

    const payload = {
      sleep_hours: parseFloat(sleep),
      exercise_mins: parseInt(exercise),
      water_ml: parseInt(water),
      systolic_bp: parseInt(systolic),
      diastolic_bp: parseInt(diastolic),
      heart_rate: parseInt(heartRate),
      weight_kg: parseFloat(weight),
      height_cm: parseFloat(height),
      diet_quality: diet,
      smoking_alcohol: smokeAlcohol
    };

    try {
      const res = await API.post("/api/health-score", payload);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to calculate score. Please verify the backend API.");
    } finally {
      setLoading(false);
    }
  };

  const resetCalculator = () => {
    setSleep(7.5);
    setExercise(30);
    setWater(2000);
    setSystolic(120);
    setDiastolic(80);
    setHeartRate(70);
    setWeight(70);
    setHeight(175);
    setDiet("Good");
    setSmokeAlcohol("None");
    setResult(null);
    setError("");
  };

  const getScoreColor = (score) => {
    if (score >= 85) return "text-brand-highlight";
    if (score >= 70) return "text-brand-accent";
    if (score >= 50) return "text-brand-warning";
    return "text-brand-danger";
  };

  const getRatingColor = (status) => {
    switch (status) {
      case "Excellent":
        return "text-brand-highlight border-brand-highlight bg-brand-highlight bg-opacity-10";
      case "Good":
        return "text-brand-accent border-brand-accent bg-brand-accent bg-opacity-10";
      case "Fair":
        return "text-brand-warning border-brand-warning bg-brand-warning bg-opacity-10";
      default:
        return "text-brand-danger border-brand-danger bg-brand-danger bg-opacity-10";
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Activity className="w-8 h-8 text-brand-highlight glow-emerald" />
            MediVision Health Score
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Input your vitals and lifestyle details to calculate your rule-based fitness rating.
          </p>
        </div>

        {result && (
          <button
            onClick={resetCalculator}
            className="flex items-center gap-2 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white border border-brand-border rounded-xl text-xs font-semibold transition-colors duration-300"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Audit</span>
          </button>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs text-brand-danger bg-brand-danger bg-opacity-10 border border-brand-danger border-opacity-20 p-4 rounded-xl">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Columns: Parameters Form (Width: 3/5 on large) */}
        {!result ? (
          <form onSubmit={handleSubmit} className="lg:col-span-3 glass-panel p-6 md:p-8 flex flex-col gap-8">
            {/* Section 1: Lifestyle Habits */}
            <div className="flex flex-col gap-6">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider border-b border-brand-border border-opacity-40 pb-2.5">
                Lifestyle Habits
              </h3>
              
              <div className="flex flex-col gap-5">
                {/* Sleep hours */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-400 flex items-center gap-1.5">
                      <Moon className="w-4 h-4 text-indigo-400" />
                      Sleep Duration
                    </span>
                    <span className="font-bold text-white bg-slate-800 px-2 py-0.5 rounded">{sleep} Hours</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="12"
                    step="0.5"
                    value={sleep}
                    onChange={(e) => setSleep(parseFloat(e.target.value))}
                    className="w-full h-1 bg-brand-border rounded-lg appearance-none cursor-pointer accent-brand-highlight"
                  />
                </div>

                {/* Exercise Mins */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-400 flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-brand-highlight" />
                      Daily Exercise
                    </span>
                    <span className="font-bold text-white bg-slate-800 px-2 py-0.5 rounded">{exercise} Minutes</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="120"
                    step="5"
                    value={exercise}
                    onChange={(e) => setExercise(parseInt(e.target.value))}
                    className="w-full h-1 bg-brand-border rounded-lg appearance-none cursor-pointer accent-brand-highlight"
                  />
                </div>

                {/* Water Intake */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-400 flex items-center gap-1.5">
                      <Droplet className="w-4 h-4 text-brand-accent" />
                      Water Hydration
                    </span>
                    <span className="font-bold text-white bg-slate-800 px-2 py-0.5 rounded">{water} ml</span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="4000"
                    step="100"
                    value={water}
                    onChange={(e) => setWater(parseInt(e.target.value))}
                    className="w-full h-1 bg-brand-border rounded-lg appearance-none cursor-pointer accent-brand-accent"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Vitals */}
            <div className="flex flex-col gap-6">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider border-b border-brand-border border-opacity-40 pb-2.5">
                Biometric Vitals
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* BP Systolic */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-400 flex items-center gap-1.5">
                      <Heart className="w-4 h-4 text-brand-danger" />
                      Systolic BP
                    </span>
                    <span className="font-bold text-white bg-slate-800 px-2 py-0.5 rounded">{systolic} mmHg</span>
                  </div>
                  <input
                    type="range"
                    min="80"
                    max="180"
                    value={systolic}
                    onChange={(e) => setSystolic(parseInt(e.target.value))}
                    className="w-full h-1 bg-brand-border rounded-lg appearance-none cursor-pointer accent-brand-danger"
                  />
                </div>

                {/* BP Diastolic */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-400 flex items-center gap-1.5">
                      <Heart className="w-4 h-4 text-brand-danger" />
                      Diastolic BP
                    </span>
                    <span className="font-bold text-white bg-slate-800 px-2 py-0.5 rounded">{diastolic} mmHg</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="120"
                    value={diastolic}
                    onChange={(e) => setDiastolic(parseInt(e.target.value))}
                    className="w-full h-1 bg-brand-border rounded-lg appearance-none cursor-pointer accent-brand-danger"
                  />
                </div>

                {/* Heart Rate */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-400 flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-brand-warning" />
                      Resting Heart Rate
                    </span>
                    <span className="font-bold text-white bg-slate-800 px-2 py-0.5 rounded">{heartRate} bpm</span>
                  </div>
                  <input
                    type="range"
                    min="45"
                    max="120"
                    value={heartRate}
                    onChange={(e) => setHeartRate(parseInt(e.target.value))}
                    className="w-full h-1 bg-brand-border rounded-lg appearance-none cursor-pointer accent-brand-warning"
                  />
                </div>

                {/* Body Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                      <Scale className="w-4 h-4 text-brand-highlight" />
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      min="30"
                      max="200"
                      value={weight}
                      onChange={(e) => setWeight(parseFloat(e.target.value) || 70)}
                      className="w-full py-2.5 px-3 glass-input text-center font-bold text-sm"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                      <Scale className="w-4 h-4 text-brand-highlight" />
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      min="100"
                      max="250"
                      value={height}
                      onChange={(e) => setHeight(parseFloat(e.target.value) || 175)}
                      className="w-full py-2.5 px-3 glass-input text-center font-bold text-sm"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Lifestyle Choices */}
            <div className="flex flex-col gap-6">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider border-b border-brand-border border-opacity-40 pb-2.5">
                Lifestyle Quality Checks
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Diet Quality */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Diet Quality</label>
                  <select
                    value={diet}
                    onChange={(e) => setDiet(e.target.value)}
                    className="w-full py-3 px-4 glass-input font-medium"
                  >
                    <option value="Poor">Poor (High sugars, processed carbs)</option>
                    <option value="Average">Average (Mixed diet)</option>
                    <option value="Good">Good (Whole grains, proteins, greens)</option>
                    <option value="Excellent">Excellent (Organic, balanced, macro-tracked)</option>
                  </select>
                </div>

                {/* Smoking / Alcohol */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Alcohol / Smoking Frequency</label>
                  <select
                    value={smokeAlcohol}
                    onChange={(e) => setSmokeAlcohol(e.target.value)}
                    className="w-full py-3 px-4 glass-input font-medium"
                  >
                    <option value="None">None (Teetotaler)</option>
                    <option value="Occasional">Occasional (Social drinks, rare smokes)</option>
                    <option value="Frequent">Frequent (Regular smoking or daily drinking)</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-brand-highlight to-brand-accent text-white font-bold rounded-xl text-sm transition-all duration-300 shadow-glass-emerald hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              ) : (
                <>
                  <Activity className="w-4 h-4" />
                  <span>Calculate Health Score</span>
                </>
              )}
            </button>
          </form>
        ) : (
          /* Scoring result card (Width: full / col span) */
          <div className="lg:col-span-5 grid grid-cols-1 md:grid-cols-5 gap-8 animate-fade-in">
            {/* Vitals Left Column: Summary Gauge */}
            <div className="md:col-span-2 glass-panel p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-brand-accent bg-opacity-[0.03] rounded-full blur-2xl"></div>
              
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-6">Score Assessment</span>
              
              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" className="stroke-brand-border fill-transparent" strokeWidth="6" />
                  <circle cx="50" cy="50" r="42" className="fill-transparent stroke-brand-highlight transition-all duration-1000 ease-out" strokeWidth="6" strokeDasharray={2*Math.PI*42} strokeDashoffset={2*Math.PI*42 * (1 - result.score / 100)} strokeLinecap="round" />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className={`text-5xl font-extrabold tracking-tight ${getScoreColor(result.score)}`}>{result.score}</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Rating</span>
                </div>
              </div>

              <div className={`mt-6 px-4 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${getRatingColor(result.status)}`}>
                {result.status}
              </div>

              <div className="grid grid-cols-2 gap-4 w-full mt-8 border-t border-brand-border border-opacity-40 pt-6">
                <div className="flex flex-col">
                  <span className="text-slate-500 text-[10px] font-semibold uppercase">Body BMI</span>
                  <span className="text-lg font-bold text-white mt-0.5">{result.bmi}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-500 text-[10px] font-semibold uppercase">Heart BPM</span>
                  <span className="text-lg font-bold text-white mt-0.5">{result.heart_rate}</span>
                </div>
              </div>
            </div>

            {/* Vitals Right Column: Breakdown & Tips */}
            <div className="md:col-span-3 flex flex-col gap-6">
              {/* Point Breakdown */}
              <div className="glass-panel p-6">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider border-b border-brand-border border-opacity-40 pb-3 mb-4">
                  Category points breakdowns
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(result.breakdown).map(([category, points], index) => {
                    const maxPoints = category === "blood_pressure" ? 20 : (category === "sleep" || category === "exercise" || category === "bmi" || category === "lifestyle") ? 15 : 10;
                    const percent = (points / maxPoints) * 100;
                    return (
                      <div key={index} className="flex flex-col gap-1.5 p-3 bg-slate-800 bg-opacity-35 border border-brand-border rounded-xl">
                        <div className="flex justify-between items-center text-xs font-semibold">
                          <span className="text-slate-400 uppercase tracking-wide truncate">{category.replace("_", " ")}</span>
                          <span className="text-white">{points}/{maxPoints} pts</span>
                        </div>
                        {/* Progress line */}
                        <div className="w-full h-1.5 bg-brand-border rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ${
                              percent > 80 ? "bg-brand-highlight" : percent > 50 ? "bg-brand-accent" : "bg-brand-warning"
                            }`}
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Suggestions / Tips list */}
              <div className="glass-panel p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider border-b border-brand-border border-opacity-40 pb-3 mb-4">
                    AI Wellness Action Plan
                  </h3>
                  
                  <div className="flex flex-col gap-3">
                    {result.tips.map((tip, index) => (
                      <div key={index} className="flex items-start gap-3 p-3.5 bg-brand-dark bg-opacity-40 border border-brand-border border-opacity-30 rounded-xl text-xs text-slate-300 leading-relaxed">
                        <CheckCircle className="w-4 h-4 text-brand-highlight shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={resetCalculator}
                  className="mt-6 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white border border-brand-border font-bold rounded-xl text-sm transition-colors duration-300 text-center w-full"
                >
                  Recalculate Score
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthScore;
