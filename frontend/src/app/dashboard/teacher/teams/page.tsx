"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { getTeams, approveTeam, deleteTeam } from "@/services/teamService";
import toast from "react-hot-toast";

type Team = {
  _id: string;
  name: string;
  status: string;
  captain: { name: string };
  members: { name: string }[];
};

export default function AdminTeamsPage() {
  const { token } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);

  const fetchTeams = async () => {
    try {
      const res = await getTeams(token!);
      setTeams(res.data);
    } catch (err) {
      toast.error("Failed to fetch teams");
    }
  };

  useEffect(() => {
    if (token) fetchTeams();
  }, [token]);

  const handleApproval = async (
    id: string,
    status: "approved" | "rejected"
  ) => {
    try {
      await approveTeam(id, status, token!);
      toast.success(`Team ${status}`);
      fetchTeams();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update team");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTeam(id, token!);
      toast.success("Team deleted");
      fetchTeams();
    } catch (err) {
      toast.error("Failed to delete team");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manage Teams</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team) => (
          <div
            key={team._id}
            className="border rounded-lg p-4 bg-white shadow space-y-2"
          >
            <h2 className="text-lg font-semibold">{team.name}</h2>
            <p>
              Status: <span className="capitalize">{team.status}</span>
            </p>
            <p>Captain: {team.captain?.name}</p>
            <p>Members: {team.members.map((m) => m.name).join(", ")}</p>

            <div className="flex gap-2 mt-2">
              {team.status === "pending" && (
                <>
                  <button
                    onClick={() => handleApproval(team._id, "approved")}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleApproval(team._id, "rejected")}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Reject
                  </button>
                </>
              )}
              <button
                onClick={() => handleDelete(team._id)}
                className="bg-gray-700 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
