import axios from "axios";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/school`;

export const getAllStudents = (token: string, filters?: any) => {
  const params = new URLSearchParams(filters).toString();
  return axios.get(`${BASE_URL}?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
export const updateStudentStatus = (
  id: string,
  status: "approved" | "rejected",

  token: string
) =>
  axios.put(
    `${BASE_URL}/students/${id}/status`,
    { status },
    { headers: { Authorization: `Bearer ${token}` } }
  );

export const getPendingStudents = (token: string) =>
  axios.get(`${BASE_URL}/students/pending`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const approveStudent = (id: string, token: string) =>
  axios.put(`${BASE_URL}/students/${id}/approve`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const rejectStudent = (id: string, token: string) =>
  axios.delete(`${BASE_URL}/students/${id}/reject`, {
    headers: { Authorization: `Bearer ${token}` },
  });
