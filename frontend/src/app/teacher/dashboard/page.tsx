"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function TeacherDashboardPage() {
  return (
    <ProtectedRoute role="teacher">
      <div className="p-6">
        <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
        <p>Only teachers can see this page.</p>
      </div>
    </ProtectedRoute>
  );
}
