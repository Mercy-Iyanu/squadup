import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toast, Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SquadUp Esports Platform",
  description: "Compete, learn, and grow with school esports.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-screen text-white relative overflow-hidden bg-[#001233]`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#001f4d] to-[#000814] opacity-95 -z-10" />

        <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-blue-700/30 blur-[160px] rounded-full -z-10" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-yellow-500/20 blur-[160px] rounded-full -z-10" />

        <AuthProvider>{children}</AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{ duration: 3000 }}
          reverseOrder={false}
        />
      </body>
    </html>
  );
}
