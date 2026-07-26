import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SymptomChecker from "./pages/SymptomChecker";
import ReportAnalyzer from "./pages/ReportAnalyzer";
import HealthScore from "./pages/HealthScore";
import Profile from "./pages/Profile";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Navbar />
      <main className="flex-1 md:ml-64 px-6 py-8 md:px-10 md:py-10 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Main Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/symptoms"
            element={
              <ProtectedRoute>
                <Layout>
                  <SymptomChecker />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Layout>
                  <ReportAnalyzer />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/health-score"
            element={
              <ProtectedRoute>
                <Layout>
                  <HealthScore />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
