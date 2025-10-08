"use client";

import { ReactNode, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

type ProtectedRouteProps = {
  children: ReactNode;
  role?: "student" | "teacher";
};

export default function ProtectedRoute({
  children,
  role,
}: ProtectedRouteProps) {
  const { user, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || !token) {
      router.push("/");
    } else if (role && user.role !== role) {
      router.push("/");
    }
  }, [user, token, role, router]);

  if (!user || !token) {
    return <p className="text-center mt-10">Checking authentication...</p>;
  }

  if (role && user.role !== role) {
    return <p className="text-center mt-10">Unauthorized</p>;
  }

  return <>{children}</>;
}
