"use client";

import { useAuth } from "@/context/AuthContext";
import StudentDashboard from "@/components/dashboard/StudentDashboard";
import TeacherDashboard from "@/components/dashboard/TeacherDashboard";

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) return <p>Loading...</p>;

  switch (user.role) {
    case "teacher":
      return <TeacherDashboard />;
    case "student":
      return <StudentDashboard />;
    default:
      return <p>Unknown role. Please contact support.</p>;
  }
}
