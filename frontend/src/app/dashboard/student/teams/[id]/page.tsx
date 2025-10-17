"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { getTeamById, joinTeam } from "@/services/teamService";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

export default function TeamDetailPage() {
  const { token, user } = useAuth();
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

  const handleJoin = async () => {
    try {
      await joinTeam(id as string, token!);
      toast.success("Joined team successfully!");
      fetchTeam();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to join team");
    }
  };

  if (!team) return <p className="p-6">Loading team details...</p>;

  const isMember = team.members.some((m: any) => m._id === user?.id);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{team.name}</h1>
        {team.logo && (
          <img
            src={team.logo}
            alt={`${team.name} logo`}
            className="w-16 h-16 object-cover rounded-full border"
          />
        )}
      </div>

      <p>
        Status: <span className="capitalize">{team.status}</span>
      </p>
      <p>School: {team.school?.name}</p>
      <p>Captain: {team.captain?.name}</p>

      <div>
        <h2 className="text-lg font-semibold mb-2">Members</h2>
        <ul className="space-y-1">
          {team.members.map((member: any) => (
            <li key={member._id} className="border-b pb-1">
              {member.name} ({member.email})
            </li>
          ))}
        </ul>
      </div>

      {team.status === "approved" && !isMember && (
        <button
          onClick={handleJoin}
          className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
        >
          Join Team
        </button>
      )}
    </div>
  );
}
