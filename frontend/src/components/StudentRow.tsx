"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { Menu, X } from "lucide-react";
import logo from "../assets/logo.png";
import defaultAvatar from "../assets/default-avatar.jpg";

export default function TopNav() {
  const router = useRouter();
  const { user, logout } = useAuth() || {};
  const [isOpen, setIsOpen] = useState(false);

  // 👇 Build nav links based on user role
  const navLinks = useMemo(() => {
    if (!user) return [];

    if (user.role === "teacher") {
      return [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/teacher/teams", label: "Teams" },
        { href: "/teacher/manage-students", label: "Students" },
        { href: "/matches", label: "Matches" },
        { href: "/leaderboard", label: "Leaderboard" },
      ];
    }

    return [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/dashboard/student/teams", label: "Teams" },
      { href: "/matches", label: "Matches" },
      { href: "/leaderboard", label: "Leaderboard" },
    ];
  }, [user]);

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
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-yellow-400 transition"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="flex items-center gap-2">
                <Image
                  src={user.avatar || defaultAvatar}
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

          <button
            className="md:hidden text-yellow-400"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4 }}
            className="fixed top-0 right-0 w-2/3 h-full bg-[#001a44] shadow-2xl border-l border-blue-800 z-40 flex flex-col p-6 space-y-6"
          >
            <div className="flex justify-between items-center">
              <Image
                src={logo}
                alt="Logo"
                width={80}
                height={80}
                className="rounded-md"
              />
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-300 hover:text-yellow-400 transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex flex-col gap-6 mt-6 text-gray-300 text-lg">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="hover:text-yellow-400 transition"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="mt-auto border-t border-gray-700 pt-4">
              {user ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <Image
                      src={user.avatar || defaultAvatar}
                      alt="User Avatar"
                      width={40}
                      height={40}
                      className="rounded-full border border-yellow-400/40"
                    />
                    <span>{user.name || "Player"}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="bg-yellow-400 hover:bg-yellow-300 text-black text-sm font-semibold px-4 py-2 rounded-md mt-2"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => router.push("/auth/login")}
                  className="bg-yellow-400 hover:bg-yellow-300 text-black text-sm font-semibold px-4 py-2 rounded-md"
                >
                  Login
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
