### ⚔️ SquadUp Feature Design Doc: Match Management

#### 1. Design Goals

**Purpose:**
Enable schools to manage internal matches (scrims and tournaments) between student teams.

**Core objectives:**

    - Allow students to request friendly scrims.
    - Allow teachers/admins to schedule, approve, and finalize matches.
    - Track scores, winners, and replay links (optional).
    - Display clear status indicators (scheduled, ongoing, completed).
    - Maintain auditability — who created and who updated match results.

---

#### 2. User Roles & Permissions

| Role            | Permissions                                                                                                                         |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Student         | 1. View matches in their school. 2. Request friendly scrims 3. View results and replays.                                            |
| Teacher/Admin   | 1. Approve/deny scrim requests. 2. Schedule tournament matches. 3. Update scores and declare winners. 4. Mark matches as completed. |
| System (future) | Auto-update ongoing → completed via cron job.                                                                                       |

---

#### 3. Data Model

**File:** `models/Match.js`

```js
const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
  {
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    teamA: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    teamB: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "ongoing", "completed"],
      default: "scheduled",
    },
    scoreA: { type: Number, default: 0 },
    scoreB: { type: Number, default: 0 },
    winner: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    matchType: {
      type: String,
      enum: ["friendly", "tournament"],
      default: "friendly",
    },
    replayLink: { type: String },
    scheduledAt: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Match", matchSchema);
```

---

#### 4. Backend Endpoints

**Base route:** `/api/matches`

| **Method** | **Endpoint**   | **Role**                          | **Description**                                       |
| ---------- | -------------- | --------------------------------- | ----------------------------------------------------- |
| `POST`     | `/request`     | Student Request a friendly match. |
| `GET`      | `/`            | All                               | List all matches for user’s school.                   |
| `POST`     | `/schedule`    | Teacher/Admin                     | Create/schedule a match (manual or tournament).       |
| `PUT`      | `/:id/approve` | Teacher/Admin                     | Approve a match request.                              |
| `PUT`      | `/:id/result`  | Teacher/Admin                     | Submit final scores, declare winner, add replay link. |
| `GET`      | `/:id`         | All View single match details.    |

**Example Controller Outline**

```js
// controllers/matchController.js

exports.requestMatch = async (req, res) => {
  /* student creates a scrim */
};
exports.getMatches = async (req, res) => {
  /* list matches by school */
};
exports.scheduleMatch = async (req, res) => {
  /* teacher schedules match */
};
exports.updateMatchResult = async (req, res) => {
  /* teacher updates score */
};
exports.approveMatch = async (req, res) => {
  /* approve scrim request */
};
```

---

#### 5. Frontend Design

**Page:** `/dashboard/matches`

**Views**
|**View** |**Description** |**Roles**|
|---|---|---|
|Match List |Displays matches with status badges and action buttons.| All|
|Request Match Modal |Form: opponent team, date/time, type (“friendly”). |Student|
|Approve/Schedule Modal |Approve pending requests or manually schedule. |Teacher/Admin|
|Result Modal |Input scores, replay link, mark as completed. |Teacher/Admin|

---

#### 6. Frontend Components

| **Component**                                   | **Purpose**                                                 |
| ----------------------------------------------- | ----------------------------------------------------------- |
| MatchCard.tsx                                   | Displays summary (teams, status, date, scores).             |
| RequestMatchModal.tsx                           | Form for student to create match request.                   |
| MatchActions.tsx                                | Conditional buttons (Approve, Update Result) based on role. |
| MatchTable.tsx Paginated table view of matches. |

---

#### 7. UI/UX Behavior

**Status Tags**

    - 🟢 **Scheduled** → match confirmed, not yet played
    -🟡 **Ongoing** → match started (future automation)
    -🔴 **Completed** → match results submitted

**Buttons & Role Logic**

    - Student: Request Scrim
    - Teacher/Admin: Approve Request, Update Result, Schedule Match

**Example (Next.js + Framer Motion)**

```tsx
{
  user.role === "student" && (
    <Button onClick={() => setOpen(true)}>Request Scrim</Button>
  );
}

{
  user.role === "teacher" && match.status === "scheduled" && (
    <Button onClick={() => openApproveModal(match)}>Approve</Button>
  );
}
```

---

#### 8. Test Scenarios (TDD Plan)

| **Area**  | **Test Case**                | **Expected Result**                     |
| --------- | ---------------------------- | --------------------------------------- |
| **Model** | Save match with both teams   | Should persist successfully             |
| **API**   | POST /request by student     | Returns 201 with status: "scheduled"    |
| **API**   | PUT /result with scores      | Updates winner correctly                |
| **UI**    | Student sees “Request Scrim” | Button visible only for students        |
| **UI**    | Teacher updates score        | Modal opens and updates list after save |

---

#### 9. Future Extensions

    - ✅ Add **cross-school** matches
    - 🕒 Add **real-time updates** (Socket.io)
    - 📺 Embed replay/video viewer
    - 🏆 Tournament bracket visualization
