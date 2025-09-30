### 📄 Feature Design Doc – Authentication & Authorization

**1. Overview**

#### Summary:
Implement a secure authentication and authorization system for students, teachers, and admins. The system should support email/password login, optional SSO (Google/Microsoft), and role-based access control (RBAC). Success means only authorized users can access features based on their role (student, teacher, admin).

The onboarding process begins with a teacher (school representative) creating a school account. A unique School Join ID is generated, which is distributed to students of that school for individual account creation.

**2. Goals**

- Teachers (school reps) can register a school (basic standard account creation).
- System generates a unique School Join ID tied to that school.
- Students can register by providing the School Join ID and their email/password.
- Admins can manage schools and oversee accounts.
- Implement session management (JWT or NextAuth).
- Protect sensitive routes based on roles.

**3. Non-Goals**

- No password reset via SMS (only email).
- No 2FA in MVP (possible later).
- No social logins beyond Google/Microsoft.

**4. User Stories / Flows**

- As a teacher:
    - I can register my school by creating an account.
    - The system generates a School Join ID for me to share with my students.
    - I can log in and manage students/teams in my school.

- As a student:
    - I can sign up with my email, password, and the School Join ID from my teacher.
    - I can log in and access student features (e.g., tournaments).

- As an admin:
    - I can create/manage schools and oversee teachers/students.

#### Flow Example (Student Registration):
Student → Register Page → Enter Email/Password + School Join ID → Verify (DB) → Create Account under School → Redirect to Dashboard

**5. Architecture & Design**

#### API Endpoints

`POST /auth/register/teacher` – register new teacher + create school + generate join code.
`POST /auth/register/student` – register new student using join code.
`POST /auth/login` – authenticate and return JWT/session.
`POST /auth/logout` – invalidate session.
`GET /auth/me` – return logged-in user details.

#### Frontend Components

`TeacherRegisterForm` – create teacher + school.
`StudentRegisterForm` – requires join code + email/password.
`LoginForm` – form with email/password.
`AuthGuard` – wrapper to protect routes based on role.

**6. Testing Strategy**

#### Unit Tests:

- Hashing/verification of passwords.
- Validation of school join code.

#### Integration Tests:

- Teacher registers → school + join code generated.
- Student registers with valid join code → account created.
- Invalid join code → registration blocked.
- Login with valid credentials → returns JWT.

#### E2E Tests:

- Teacher creates school → logs in → sees teacher dashboard.
- Student registers with join code → logs in → sees student dashboard.

**7. Deployment & Rollout**

- Deploy backend auth API + frontend forms to staging.
- Run automated tests in CI/CD.
- Manually test teacher + student onboarding flow in staging.
- Release to production.

**8. Risks & Mitigations**

- *Risk:* Join code leaks publicly → allow teachers/admins to regenerate join code.
- *Risk:* Brute-force login attempts → add rate limiting.
- *Risk:* Password leaks → store only salted bcrypt hashes.
- *Risk:* Unauthorized access → enforce RBAC middleware.

**9. Open Questions**

- Should join codes expire after first use or be permanent until regenerated?
- Should teachers manually approve students after registration, or should join code be enough?
- Should admins have visibility into all join codes?