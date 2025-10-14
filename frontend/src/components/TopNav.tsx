"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import logo from "../assets/logo.png";

export default function TopNav() {
  const router = useRouter();
  const { user, logout } = useAuth() || {};

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full fixed top-0 z-50 bg-[#001233]/80 backdrop-blur-md border-b border-blue-900/40 shadow-md"
    >
      <div className="flex items-center justify-between px-6 md:px-10 py-3">
        <div className="flex items-center gap-2">
          <Image
            src={logo}
            alt="SquadUp Logo"
            width={100}
            height={100}
            className="rounded-md"
          />
        </div>

        <div className="hidden md:flex items-center gap-8 text-gray-300 text-sm">
          <Link href="/dashboard" className="hover:text-yellow-400 transition">
            Dashboard
          </Link>
          <Link href="/teams" className="hover:text-yellow-400 transition">
            Teams
          </Link>
          <Link href="/matches" className="hover:text-yellow-400 transition">
            Matches
          </Link>
          <Link
            href="/leaderboard"
            className="hover:text-yellow-400 transition"
          >
            Leaderboard
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="flex items-center gap-2">
                <Image
                  src={user.avatar || "/default-avatar.png"}
                  alt="User Avatar"
                  width={35}
                  height={35}
                  className="rounded-full border border-yellow-400/40"
                />
                <span className="text-sm text-gray-300 hidden sm:block">
                  {user.name || "Player"}
                </span>
              </div>
              <button
                onClick={logout}
                className="ml-2 bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-semibold px-3 py-1 rounded-md"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => router.push("/auth/login")}
              className="bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-semibold px-3 py-1 rounded-md"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
