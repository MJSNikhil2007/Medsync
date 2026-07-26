import React, { useState } from "react";
import API from "../services/api";
import UploadZone from "../components/UploadZone";
import { 
  FileText, 
  TrendingUp, 
  HelpCircle, 
  RefreshCw, 
  ShieldAlert,
  ChevronRight,
  TrendingDown
} from "lucide-react";

const ReportAnalyzer = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleFileUpload = async (file) => {
    setAnalyzing(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await API.post("/api/reports/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setResult(res.data);
    } catch (err) {
      console.error("Report analysis failed:", err);
      setError(
        err.response?.data?.detail || 
        "OCR Extraction or parsing failed. Please verify that the file is readable and try again."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const resetAnalyzer = () => {
    setResult(null);
    setError("");
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "High":
        return {
          badge: "text-brand-danger border-brand-danger bg-brand-danger bg-opacity-10",
          border: "border-brand-danger border-opacity-20 hover:border-brand-danger hover:border-opacity-40 hover:shadow-glass-danger",
          icon: <TrendingUp className="w-5 h-5 text-brand-danger" />
        };
      case "Low":
        return {
          badge: "text-brand-warning border-brand-warning bg-brand-warning bg-opacity-10",
          border: "border-brand-warning border-opacity-20 hover:border-brand-warning hover:border-opacity-40",
          icon: <TrendingDown className="w-5 h-5 text-brand-warning" />
        };
      default:
        return {
          badge: "text-brand-highlight border-brand-highlight bg-brand-highlight bg-opacity-10",
          border: "border-brand-border hover:border-slate-700",
          icon: <ChevronRight className="w-5 h-5 text-brand-highlight" />
        };
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <FileText className="w-8 h-8 text-brand-accent glow-cyan" />
            AI Medical Report Analyzer
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Upload PDF lab reports or images to automatically run OCR text extraction and get explanations.
          </p>
        </div>

        {result && (
          <button
            onClick={resetAnalyzer}
            className="flex items-center gap-2 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white border border-brand-border rounded-xl text-xs font-semibold transition-colors duration-300"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Analyze Another Report</span>
          </button>
        )}
      </div>

      {!result ? (
        <div className="max-w-2xl mx-auto w-full py-12">
          <UploadZone 
            onFileSelected={handleFileUpload} 
            isAnalyzing={analyzing} 
            error={error} 
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 animate-fade-in">
          {/* Left Columns: Parameters list (Width: 3/5 on large) */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                Extracted Parameters & Metrics
              </h3>
              
              <div className="grid grid-cols-1 gap-4">
                {result.metrics.map((metric, i) => {
                  const style = getStatusStyle(metric.status);
                  return (
                    <div
                      key={i}
                      className={`glass-panel p-5 relative overflow-hidden transition-all duration-300 border flex flex-col gap-3 group ${style.border}`}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-white group-hover:text-brand-accent transition-colors">
                            {metric.name}
                          </span>
                          <span className="text-xs text-slate-500 mt-0.5">
                            Reference: {metric.reference_range} {metric.unit}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className="text-lg font-extrabold text-white">
                              {metric.value}
                            </span>
                            <span className="text-xs text-slate-400 font-medium ml-1">
                              {metric.unit}
                            </span>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${style.badge}`}>
                            {metric.status}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-xs text-slate-400 leading-relaxed border-t border-brand-border border-opacity-40 pt-2.5">
                        {metric.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: AI Explanations & Glossary (Width: 2/5 on large) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Report Summary */}
            <div className="glass-panel p-6 flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider border-b border-brand-border border-opacity-40 pb-3">
                Clinical Overview
              </h3>
              <p className="text-xs text-slate-200 leading-relaxed bg-[#0c1224] bg-opacity-50 p-4 rounded-xl border border-brand-border">
                {result.summary}
              </p>
            </div>

            {/* Glossary Terms Explanations */}
            <div className="glass-panel p-6 flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider border-b border-brand-border border-opacity-40 pb-3 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-brand-accent glow-cyan" />
                Medical Glossary Explanation
              </h3>
              
              <div className="flex flex-col gap-4">
                {result.explanations.map((exp, i) => (
                  <div key={i} className="flex flex-col gap-1.5 p-3.5 bg-slate-800 bg-opacity-35 border border-brand-border rounded-xl">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">{exp.term}</span>
                    <p className="text-xs text-slate-300 leading-relaxed">{exp.meaning}</p>
                    <span className="text-[10px] text-slate-500 font-medium mt-1">Context: {exp.context}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="flex gap-2.5 p-3.5 rounded-xl bg-brand-danger bg-opacity-5 border border-brand-danger border-opacity-10 text-[10px] text-slate-500 leading-normal">
              <ShieldAlert className="w-5 h-5 text-brand-danger shrink-0 mt-0.5 opacity-70" />
              <p>
                <strong>OCR Disclaimer:</strong> Text extraction performance depends heavily on the clarity of your document. Double-check important values manually. This is for screening guidance, not diagnostic decisions.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportAnalyzer;
