// src/App.jsx
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute"; // use your real path

import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import ComingSoon from "./pages/ComingSoon";
import NewInterview from "./pages/NewInterview";
import InterviewSession from "./pages/InterviewSession";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ProtectedRoute checks auth, then renders the matching child route */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="interview" element={<NewInterview />} />
          <Route path="interview/session/:id" element={<InterviewSession />} />
          <Route path="history" element={<ComingSoon title="My Interviews" />} />
          <Route path="history/:id" element={<ComingSoon title="Interview Report" />} />
          <Route path="resume" element={<ComingSoon title="Resume Analysis" />} />
          <Route path="performance" element={<ComingSoon title="Performance Reports" />} />
          <Route path="settings" element={<ComingSoon title="Settings" />} />
          <Route path="help" element={<ComingSoon title="Help & Support" />} />
        </Route>
      </Route>
    </Routes>
  );
}