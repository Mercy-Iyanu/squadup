"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getMatches, createMatch } from "@/services/matchService";
import MatchCard from "@/components/MatchCard";
import Button from "@/components/ui/Button";
import { toast } from "react-hot-toast";

export default function StudentMatches() {
  const [matches, setMatches] = useState([]);
  const { token, user } = useAuth();

  useEffect(() => {
    if (!token) return;
    getMatches(token)
      .then((data) => setMatches(data.matches))
      .catch(() => toast.error("Failed to fetch matches"));
  }, [token]);

  const requestScrim = async () => {
    try {
      await createMatch(
        {
          teamA: user.teamId,
          teamB: "opponentTeamId",
          matchType: "friendly",
          scheduledAt: new Date(),
        },
        token
      );
      toast.success("Scrim request sent!");
    } catch {
      toast.error("Failed to send scrim request");
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Matches</h1>
        <Button onClick={requestScrim}>Request Scrim</Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {matches.map((m) => (
          <MatchCard key={m._id} match={m} />
        ))}
      </div>
    </div>
  );
}
