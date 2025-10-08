"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

type LoginFormData = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        login(result.user, result.token);
        setMessage("Login successful! Redirecting...");

        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1500);
      } else {
        setMessage(result.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setMessage("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-blue-400 rounded shadow ">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          type="email"
          {...register("email", { required: true })}
          placeholder="Email"
          className="w-full border p-2"
        />
        {errors.email && (
          <span className="text-red-500">Email is required</span>
        )}

        <input
          type="password"
          {...register("password", { required: true })}
          placeholder="Password"
          className="w-full border p-2"
        />
        {errors.password && (
          <span className="text-red-500">Password is required</span>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <Link href="/auth/register">Create an account</Link>
      </form>

      {message && (
        <div className="mt-4 p-3 bg-regal-blue rounded">
          <p>{message}</p>
        </div>
      )}
    </div>
  );
}
