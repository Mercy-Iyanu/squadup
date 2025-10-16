### 🧩 SquadUp Feature Design Doc: Team Management

**1. Feature Overview**

The Team Management System enables approved students within a school to form, join, and manage esports teams.
School admins (teachers) oversee team approvals to maintain structure and integrity.

This is the bridge between auth/school management and match/tournament systems.

---

**2. Goals & Requirements**

#### 🎯 Core Goals

- Students can create or join a team inside their school.
- A team must be approved by the school admin before activation.
- Each team has a captain (the student who created it).
- School admin can view, approve, or reject teams.
- Teams can participate in matches and tournaments once approved.

#### 📋 Functional Requirements

| Function            | Actor   |                                 Description |
| :------------------ | ------- | ------------------------------------------: |
| Create team         | Student |         Create new team (pending approval). |
| Approve/reject team | Admin   |           Accept or deny new team creation. |
| Join team           | Student | Join an approved team with available slots. |
| View teams          | Both    |                   List teams within school. |
| Leave team          | Student |      Option to leave a team if not captain. |
| Delete team         | Admin   |                  Remove a team (if needed). |

---

**3. Data Model Design**

#### Team Schema

```js
const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  logo: { type: String },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
    required: true,
  },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  captain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Team", teamSchema);
```

#### Relations

- `Team.school` → references `School`
- `Team.members` → references `User`
- `Team.captain` → User who created team

---

**4. API Endpoints**

| Endpoint                 |  Method  |   Auth Description   |
| :----------------------- | :------: | :------------------: | ------------------------------------: |
| `/api/teams`             |  `POST`  |       Student        |   Create new team (pending approval). |
| `/api/teams`             |  `GET`   |    Authenticated     |             List all teams in school. |
| `/api/teams/:id/join`    |  `POST`  |       Student        | Join a team if approved and not full. |
| `/api/teams/:id/approve` | `PATCH`  |        Admin         |             Approve or reject a team. |
| `/api/teams/:id`         | `DELETE` | Admin Delete a team. |

---

**5. Frontend Integration**

#### Student Dashboard (`/dashboard/team`)

    - If no team:
        → Show Create/Join Team card.
    - If in team:
        → Show Team profile (logo, members, captain).
    - Allow editing logo/name (if captain).
    - Show pending status if awaiting approval.

#### Admin Dashboard (`/dashboard/admin/teams`)

    - Pending team requests list (with Approve/Reject buttons).
    - Overview of active teams in school.
    - Ability to delete or deactivate a team.

---

**6. Permissions & Rules**

| Rule                                                             | Description |
| :--------------------------------------------------------------- | ----------: |
| A student can belong to only one team per school.                |
| A team must be approved before joining tournaments/matches.      |
| Only the captain can update team info.                           |
| Admin has full moderation rights over all teams in their school. |

---

**7. Testing Strategy (TDD)**

#### Unit Tests

    - ✅ Should create a team (status: pending).
    - ✅ Should fail if student already belongs to a team.
    - ✅ Should allow admin to approve a team.
    - ✅ Should prevent joining team if team is pending or full.
    - ✅ Should allow admin to delete team.

#### Integration Tests

- Simulate team creation and approval flow.
- Verify team membership constraints.
- Test permission boundaries (e.g., student vs. admin actions).

#### Example (Jest + Supertest):

```js
describe("Team creation flow", () => {
  it("should create team as pending", async () => {
    const res = await request(app)
      .post("/api/teams")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({ name: "Valor Titans" });
    expect(res.status).toBe(201);
    expect(res.body.status).toBe("pending");
  });
});
```

---

**8. Acceptance Criteria**

    ✅ Student can create a team (pending approval).
    ✅ Admin can approve/reject teams.
    ✅ Students can join approved teams.
    ✅ Teams appear in the dashboard filtered by school.
    ✅ Proper permission checks (student/admin).
    ✅ All relevant API endpoints covered with unit & integration tests.

---

**9. Next Steps**

Once this feature is stable:

1. Introduce **Match creation** (between two approved teams).
2. Build **Tournament MVP** on top of match logic.
3. Add **Team stats tracking** (wins, losses, points).
