# SQUADUP 🎮🏫

An esports platform for schools where students can register, form teams, and compete under teacher supervision.  
Built with **Next.js** (frontend) and **Node.js/Express** (backend).

---

## 🚀 Features
- 👨‍🏫 Teacher and student registration & authentication
- 🎲 Team creation and management
- 🏆 Organize and track competitions
- 📊 Future: leaderboards, match history, and statistics

---

## 🛠️ Tech Stack
- **Frontend:** Next.js, React, TypeScript  
- **Backend:** Node.js, Express, MongoDB  
- **Other Tools:** GitHub Actions (CI/CD), ESLint, Prettier  

---

## 📂 Project Structure

SQUADUP/
│── backend/ # Node.js + Express API
│── frontend/ # Next.js frontend
│── docs/ # Documentation

---

## ⚡ Getting Started

### Prerequisites
- Node.js (>= 18)
- MongoDB (local or Atlas)

### Installation
1. Clone the repo:
   ```bash
   git clone https://github.com/<your-username>/squadup.git
   cd squadup
   ```
2. Install Dependencies
  ```bash
  cd backend && npm install
  cd ../frontend && npm install
  ```
3. Configure environment variables:
   - Copy `.env.example` to `.env` (both in backend and frontend).
   - Add your database URL, API keys, etc.
4. Run development servers:
   ```bash
   # In backend
    npm run dev

    # In frontend
    npm run dev
   ```

---


🤝 Contributing
Contributions, issues, and feature requests are welcome!
Feel free to check the issues page

📜 License
This project is licensed under the MIT License.
