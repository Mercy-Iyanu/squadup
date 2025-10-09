"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";

export default function TeacherDashboard() {
  return (
    <ProtectedRoute role="teacher">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Teacher Dashboard</h1>
        <p>Manage tournaments, approve teams, and track student performance.</p>
        <Link
          href="/dashboard/teacher/manage-students"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Manage Students
        </Link>
      </div>
    </ProtectedRoute>
  );
}
