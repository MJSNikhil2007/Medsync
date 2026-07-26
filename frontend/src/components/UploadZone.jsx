import React, { useState, useRef } from "react";
import { UploadCloud, File, AlertCircle, Loader } from "lucide-react";

const UploadZone = ({ onFileSelected, isAnalyzing, error }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const validateAndProcessFile = (file) => {
    const file_name_lower = file.name.toLowerCase();
    if (
      file_name_lower.endsWith(".pdf") ||
      file_name_lower.endsWith(".png") ||
      file_name_lower.endsWith(".jpg") ||
      file_name_lower.endsWith(".jpeg")
    ) {
      setSelectedFile(file);
      onFileSelected(file);
    } else {
      alert("Unsupported file format. Please upload a PDF or an Image (PNG, JPG).");
    }
  };

  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={selectedFile ? null : onButtonClick}
        className={`w-full py-10 px-6 glass-panel border-dashed border-2 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
          dragActive ? "border-brand-highlight bg-brand-highlight bg-opacity-[0.02] scale-[1.01]" : "border-brand-border hover:border-slate-600"
        } ${selectedFile ? "cursor-default" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={handleChange}
          disabled={isAnalyzing}
        />

        {isAnalyzing ? (
          <div className="flex flex-col items-center gap-4 py-4">
            <Loader className="w-12 h-12 text-brand-accent animate-spin" />
            <div className="flex flex-col gap-1">
              <p className="text-white font-semibold text-base">Running AI Medical OCR Analyzer...</p>
              <p className="text-slate-400 text-xs">Extracting parameters, scanning ranges, and explaining terms</p>
            </div>
          </div>
        ) : selectedFile ? (
          <div className="flex flex-col items-center gap-4 w-full max-w-md">
            <div className="p-3 bg-brand-accent bg-opacity-10 rounded-2xl border border-brand-accent border-opacity-20 text-brand-accent glow-cyan">
              <File className="w-8 h-8" />
            </div>
            <div className="text-center overflow-hidden w-full">
              <p className="text-slate-200 font-semibold text-sm truncate">{selectedFile.name}</p>
              <p className="text-slate-400 text-xs mt-1">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
            
            <div className="flex gap-3 w-full mt-2">
              <button
                type="button"
                onClick={onButtonClick}
                className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs transition-colors duration-300 border border-brand-border"
              >
                Change File
              </button>
              <button
                type="button"
                onClick={clearFile}
                className="flex-1 py-2.5 px-4 bg-brand-danger bg-opacity-10 hover:bg-opacity-20 text-brand-danger font-semibold rounded-xl text-xs border border-brand-danger border-opacity-20 transition-colors duration-300"
              >
                Clear
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="p-4 bg-brand-border bg-opacity-40 rounded-2xl border border-brand-border text-slate-400 transition-colors duration-300">
              <UploadCloud className="w-10 h-10 text-slate-400 group-hover:text-brand-accent" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-slate-200 font-semibold text-base">
                Drag and drop your report here, or <span className="text-brand-highlight">browse</span>
              </p>
              <p className="text-slate-400 text-xs">Supports medical report PDFs, PNGs, and JPGs</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 mt-4 text-xs text-brand-danger bg-brand-danger bg-opacity-10 border border-brand-danger border-opacity-20 p-3 rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default UploadZone;
