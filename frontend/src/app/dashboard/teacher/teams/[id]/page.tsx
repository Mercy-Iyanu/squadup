"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { getTeamById, approveTeam, deleteTeam } from "@/services/teamService";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminTeamDetailPage() {
  const { token } = useAuth();
  const { id } = useParams();
  const [team, setTeam] = useState<any>(null);

  const fetchTeam = async () => {
    try {
      const res = await getTeamById(id as string, token!);
      setTeam(res.data);
    } catch (err) {
      toast.error("Failed to load team details");
    }
  };

  useEffect(() => {
    if (token && id) fetchTeam();
  }, [token, id]);

  const handleApproval = async (status: "approved" | "rejected") => {
    try {
      await approveTeam(id as string, status, token!);
      toast.success(`Team ${status}`);
      fetchTeam();
    } catch (err) {
      toast.error("Failed to update team");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTeam(id as string, token!);
      toast.success("Team deleted");
    } catch (err) {
      toast.error("Failed to delete team");
    }
  };

  if (!team) return <p className="p-6">Loading team...</p>;

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{team.name}</h1>
        {team.logo && (
          <img
            src={team.logo}
            alt={`${team.name} logo`}
            className="w-16 h-16 rounded-full border"
          />
        )}
      </div>

      <p>
        Status: <span className="capitalize">{team.status}</span>
      </p>
      <p>School: {team.school?.name}</p>
      <p>Captain: {team.captain?.name}</p>

      <div>
        <h2 className="font-semibold mt-4 mb-2">Members</h2>
        <ul className="space-y-1">
          {team.members.map((m: any) => (
            <li key={m._id}>
              {m.name} ({m.email})
            </li>
          ))}
        </ul>
      </div>

      {team.status === "pending" && (
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => handleApproval("approved")}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Approve
          </button>
          <button
            onClick={() => handleApproval("rejected")}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Reject
          </button>
        </div>
      )}

      <button
        onClick={handleDelete}
        className="bg-gray-700 text-white px-4 py-2 rounded mt-4"
      >
        Delete Team
      </button>
    </div>
  );
}
