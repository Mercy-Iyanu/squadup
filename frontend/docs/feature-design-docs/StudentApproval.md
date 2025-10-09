### 📄 Feature Design Doc — Teacher Student Approval Management

**1. Overview**

Teachers need to manage students who register under their school but are not yet approved.
This ensures that only verified students gain access to their dashboards and activities.

#### Feature Summary:
- Teachers can view pending student registrations for their school.
- Teachers can approve or reject students.
- Approved students gain dashboard access.
- Rejected students lose access and can optionally reapply later (future extension).

**2. Goals & Non-Goals**

#### Goals
- Give teachers visibility into student registration status.
- Allow approval/rejection directly from the teacher dashboard.
- Enforce access control — unapproved students cannot access dashboards.

#### Non-Goals (for this phase)
- Email notifications upon approval/rejection.
- Student appeal or re-application flow.
- Bulk approval operations.

**3. User Stories**
#### 👩‍🏫 As a Teacher
- I want to see a list of all students who registered under my school but haven’t been approved.
- I want to approve or reject a student.
- I want to view a history of all student registrations (pending, approved, rejected).

#### 👩‍🎓 As a Student
- I want to register under a school and know that my account is pending approval.
- I should not be able to access the student dashboard until my teacher approves me.

**4. System Architecture & Data Flow**

```plaintext
Student signs up → status="pending", approved=false
            ↓
Teacher logs in → Dashboard → “Manage Students” page
            ↓
Teacher calls:
  - GET /api/schools/students/pending
  - PUT /api/schools/students/:id/approve
  - DELETE /api/schools/students/:id/reject
            ↓
Backend updates student's status
            ↓
Approved students can now access dashboard
```

5. API Design

| Method | Endpoint | Description | Auth | Role |
| :--- | :--- | :--- | :--- | :--- |
| GET | /api/schools/students/pending | List pending students for the teacher’s school | ✅ | Teacher |
| PUT | /api/schools/students/:studentId/approve | Approve student | ✅ | Teacher |
| DELETE | /api/schools/students/:studentId/reject | Reject student | ✅ | Teacher |
| GET | /api/schools/students/history?status=&page=&limit= | Paginated history of all students | ✅ | Teacher |

6. Frontend Design

**🔹 Teacher Dashboard**
Add a “Manage Students” section accessible from the dashboard sidebar or top-nav.

**UI Wireframe:**

```less
Teacher Dashboard
--------------------------
[ Manage Students ] ← new button

Manage Students Page
-----------------------------------------
| Name         | Email           | Status  | Actions        |
|--------------|-----------------|---------|----------------|
| John Doe     | john@email.com  | pending | [Approve][Reject] |
| Mary Smith   | mary@email.com  | pending | [Approve][Reject] |
```

**UX Flow:**
    
    1. Teacher clicks “Manage Students”.
    2. Page calls GET /students/pending.
    3. Displays table of pending students.
    4. Approve → triggers PUT /students/:id/approve.
    5. Reject → triggers DELETE /students/:id/reject.
    6. Show toast notification and refresh list.

