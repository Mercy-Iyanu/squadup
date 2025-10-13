"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import mockup1 from "../assets/mockup1.webp";
import logo from "../assets/logo.png";

export default function SplashPage() {
  return (
    <div className="min-h-screen bg-[#001233] flex flex-col items-center justify-center text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#001f4d] to-[#000814] opacity-90" />

      <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-blue-700/40 blur-[180px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-yellow-500/30 blur-[180px] rounded-full" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-12 px-6 md:px-20">
        <div className="relative flex items-center justify-center">
          <Image
            src={mockup1}
            alt="App Screenshot 1"
            width={600}
            height={800}
            className="rounded-2xl rotate-[-5deg] shadow-lg"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="max-w-xl text-center md:text-left"
        >
          <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
            <Image
              src={logo}
              alt="Logo"
              width={300}
              height={300}
              className="rounded-lg"
            />
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
            PLAY ESPORTS <span className="text-yellow-400">FOR FREE</span>
          </h2>

          <p className="text-lg md:text-xl mb-6 opacity-90">
            Challenge your classmates, form teams, and climb the leaderboard to
            win prizes.
          </p>

          <motion.div whileHover={{ scale: 1.05 }}>
            <Link
              href="/auth/login"
              className="inline-block bg-yellow-400 text-black font-semibold px-8 py-3 rounded-md shadow-md hover:bg-yellow-300 transition"
            >
              LOGIN
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        className="absolute bottom-4 text-sm text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        © {new Date().getFullYear()} SquadUp Esports
      </motion.div>
    </div>
  );
}
