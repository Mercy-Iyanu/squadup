import axios from "axios";

export const getPendingStudents = (token: string) =>
  axios.get(`${process.env.NEXT_PUBLIC_API_URL}/school/students/pending`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const approveStudent = (id: string, token: string) =>
  axios.put(`${process.env.NEXT_PUBLIC_API_URL}/school/students/${id}/approve`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const rejectStudent = (id: string, token: string) =>
  axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/school/students/${id}/reject`, {
    headers: { Authorization: `Bearer ${token}` },
  });
