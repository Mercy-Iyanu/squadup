"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { getTeams, createTeam, joinTeam } from "@/services/teamService";
import toast from "react-hot-toast";

type Team = {
  _id: string;
  name: string;
  logo?: string;
  status: string;
  members: { name: string }[];
  captain: { name: string };
};

export default function StudentTeamsPage() {
  const { token } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamName, setTeamName] = useState("");

  const fetchTeams = async () => {
    try {
      const res = await getTeams(token!);
      setTeams(res.data);
    } catch (err) {
      toast.error("Failed to load teams");
    }
  };

  useEffect(() => {
    if (token) fetchTeams();
  }, [token]);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTeam({ name: teamName }, token!);
      toast.success("Team created successfully");
      setTeamName("");
      fetchTeams();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create team");
    }
  };

  const handleJoin = async (id: string) => {
    try {
      await joinTeam(id, token!);
      toast.success("Joined team successfully");
      fetchTeams();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to join team");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Teams</h1>

      <form onSubmit={handleCreateTeam} className="flex gap-2">
        <input
          type="text"
          placeholder="Enter team name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className="border rounded px-3 py-2 w-full"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Team
        </button>
      </form>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team) => (
          <div
            key={team._id}
            className="border rounded-lg p-4 shadow bg-white space-y-2"
          >
            <h2 className="text-lg font-semibold">{team.name}</h2>
            <p>
              Status: <span className="capitalize">{team.status}</span>
            </p>
            <p>Captain: {team.captain?.name}</p>
            <p>Members: {team.members.map((m) => m.name).join(", ")}</p>

            {team.status === "approved" && (
              <button
                onClick={() => handleJoin(team._id)}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Join Team
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
