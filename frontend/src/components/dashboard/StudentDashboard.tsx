"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function StudentDashboard() {
  return (
    <ProtectedRoute role="student">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
        <p>Welcome! Here are your current competitions, matches, and points.</p>
      </div>
    </ProtectedRoute>
  );
}
