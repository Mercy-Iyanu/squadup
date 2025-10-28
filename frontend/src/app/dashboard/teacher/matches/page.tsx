"use client";
import { useEffect, useState } from "react";
import MatchCard from "@/components/MatchCard";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import {
  getMatches,
  approveMatch,
  updateMatchResult,
} from "@/services/matchService";

// 👇 Define a Match type
type Match = {
  _id: string;
  teamA: { name: string };
  teamB: { name: string };
  status: string;
  scoreA?: number;
  scoreB?: number;
  scheduledAt?: string;
};

export default function TeacherMatches() {
  // ✅ give useState a type
  const [matches, setMatches] = useState<Match[]>([]);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;
    getMatches(token)
      .then((data) => setMatches(data.matches))
      .catch(() => toast.error("Failed to fetch matches"));
  }, [token]);

  const handleApprove = async (id: string) => {
    if (!token) return toast.error("Not authorized");

    try {
      await approveMatch(id, token); // ✅ token is definitely a string here
      toast.success("Match approved!");
      setMatches((prev) =>
        prev.map((m) => (m._id === id ? { ...m, status: "completed" } : m))
      );
    } catch {
      toast.error("Approval failed");
    }
  };

  const handleUpdateScore = async (id: string) => {
    if (!token) return toast.error("Not authorized");

    try {
      const data = { scoreA: 2, scoreB: 1 };
      await updateMatchResult(id, data, token);
      toast.success("Score updated!");
      setMatches((prev) =>
        prev.map((m) =>
          m._id === id ? { ...m, ...data, status: "completed" } : m
        )
      );
    } catch {
      toast.error("Failed to update score");
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Manage Matches</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {matches.map((m) => (
          <MatchCard
            key={m._id}
            match={m}
            onApprove={handleApprove}
            onUpdate={handleUpdateScore}
          />
        ))}
      </div>
    </div>
  );
}
