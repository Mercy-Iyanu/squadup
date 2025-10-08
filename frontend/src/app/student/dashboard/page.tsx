"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function StudentDashboardPage() {
  return (
    <ProtectedRoute role="student">
      <div className="p-6">
        <h1 className="text-2xl font-bold">Student Dashboard</h1>
        <p>Only students can see this page.</p>
      </div>
    </ProtectedRoute>
  );
}
