"use client";

import { useEffect, useState } from "react";
import { getAllStudents, updateStudentStatus } from "@/services/studentService";
import { useAuth } from "@/context/AuthContext";
import StudentTable from "@/components/StudentTable";
import ProtectedRoute from "@/components/ProtectedRoute";
import { toast } from "react-hot-toast";

export default function ManageStudentsPage() {
  const { token } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    search: "",
    page: 1,
  });
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 1,
  });

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await getAllStudents(token!, filters);
      setStudents(res.data.students);
      setPagination(res.data.pagination);
    } catch (err) {
      toast.error("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [filters]);

  const handleChangeStatus = async (
    id: string,
    status: "approved" | "rejected"
  ) => {
    try {
      await updateStudentStatus(id, status, token!);
      toast.success(`Student ${status}`);
      setStudents((prev) =>
        prev.map((s) => (s._id === id ? { ...s, status } : s))
      );
    } catch (err) {
      toast.error("Error updating status");
    }
  };

  return (
    <ProtectedRoute role="teacher">
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">Manage Students</h1>

        {/* Filters */}
        <div className="flex gap-4 items-center">
          <input
            type="text"
            placeholder="Search by name/email"
            value={filters.search}
            onChange={(e) =>
              setFilters((f) => ({ ...f, search: e.target.value, page: 1 }))
            }
            className="border rounded px-3 py-1 text-sm w-64"
          />
          <select
            value={filters.status}
            onChange={(e) =>
              setFilters((f) => ({ ...f, status: e.target.value, page: 1 }))
            }
            className="border rounded px-3 py-1 text-sm"
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <StudentTable
            students={students}
            onChangeStatus={handleChangeStatus}
          />
        )}

        {/* Pagination */}
        <div className="flex justify-between items-center pt-4">
          <button
            disabled={filters.page <= 1}
            onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {filters.page} of {pagination.pages}
          </span>
          <button
            disabled={filters.page >= pagination.pages}
            onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
