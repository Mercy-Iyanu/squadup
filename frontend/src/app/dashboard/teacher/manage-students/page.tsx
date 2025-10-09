"use client";

import { useEffect, useState } from "react";
import {
  getPendingStudents,
  approveStudent,
  rejectStudent,
} from "@/services/studentService";
import { useAuth } from "@/context/AuthContext";
import StudentTable from "@/components/StudentTable";
import ProtectedRoute from "@/components/ProtectedRoute";
import { toast } from "react-hot-toast";

export default function ManageStudentsPage() {
  const { token } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      const res = await getPendingStudents(token!);
      setStudents(res.data.pendingStudents);
    } catch (err) {
      console.error("Error fetching students:", err);
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChangeStatus = async (
    id: string,
    status: "approved" | "rejected"
  ) => {
    try {
      if (status === "approved") {
        await approveStudent(id, token!);
        toast.success("Student approved");
      } else {
        await rejectStudent(id, token!);
        toast.error("Student rejected");
      }

      // Update UI instantly
      setStudents((prev) =>
        prev.map((s) => (s._id === id ? { ...s, status } : s))
      );
    } catch (err) {
      toast.error(`Error updating student status`);
    }
  };

  return (
    <ProtectedRoute role="teacher">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Manage Students</h1>
        {loading ? (
          <p>Loading...</p>
        ) : students.length === 0 ? (
          <p>No pending students.</p>
        ) : (
          <StudentTable
            students={students}
            onChangeStatus={handleChangeStatus}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
