import axios from "axios";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/team`;

export const getTeams = (token: string) =>
  axios.get(BASE_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getTeamById = (id: string, token: string) =>
  axios.get(`${BASE_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });


export const createTeam = (data: { name: string; logo?: string }, token: string) =>
  axios.post(BASE_URL, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const joinTeam = (id: string, token: string) =>
  axios.post(`${BASE_URL}/${id}/join`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const approveTeam = (
  id: string,
  status: "approved" | "rejected",
  token: string
) =>
  axios.patch(`${BASE_URL}/${id}/approve`, { status }, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteTeam = (id: string, token: string) =>
  axios.delete(`${BASE_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
