"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function TeacherDashboard() {
  return (
    <ProtectedRoute role="teacher">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Teacher Dashboard</h1>
        <p>Manage tournaments, approve teams, and track student performance.</p>
      </div>
    </ProtectedRoute>
  );
}
