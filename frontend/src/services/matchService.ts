import axios from "axios";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/matches`;

export const getMatches = async (token: string) => {
  const res = await axios.get(BASE_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const createMatch = async (data: any, token: string) => {
  const res = await axios.post(BASE_URL, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const approveMatch = async (id: string, token: string) => {
  const res = await axios.patch(
    `${BASE_URL}/${id}/approve`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const updateMatchResult = async (
  id: string,
  data: any,
  token: string
) => {
  const res = await axios.patch(
    `${BASE_URL}/${id}/result`,
    data,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};
export const deleteMatch = async (id: string, token: string) => {
  const res = await axios.delete(`${BASE_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}