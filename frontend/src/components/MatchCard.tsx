"use client";

import Card from "./ui/Card";
import Badge from "./ui/Badge";

export default function MatchCard({ match, onApprove, onUpdate }) {
  return (
    <Card>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">
          {match.teamA.name} ⚔️ {match.teamB.name}
        </h3>
        <Badge
          color={
            match.status === "completed"
              ? "green"
              : match.status === "scheduled"
              ? "yellow"
              : "gray"
          }
        >
          {match.status}
        </Badge>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-500">
        <div>
          Type: {match.matchType}
          <br />
          Scheduled: {new Date(match.scheduledAt).toLocaleString()}
        </div>
        {match.status === "completed" && (
          <div className="font-bold text-black-800">
            {match.scoreA} - {match.scoreB}
          </div>
        )}
      </div>

      {(onApprove || onUpdate) && match.status === "scheduled" && (
        <div className="flex justify-end mt-3 gap-2">
          {onApprove && (
            <button
              className="px-3 py-1 rounded-md bg-green-500 text-white hover:bg-green-600"
              onClick={() => onApprove(match._id)}
            >
              Approve
            </button>
          )}
          {onUpdate && (
            <button
              className="px-3 py-1 rounded-md bg-blue-500 text-white hover:bg-blue-600"
              onClick={() => onUpdate(match._id)}
            >
              Update Score
            </button>
          )}
        </div>
      )}
    </Card>
  );
}
