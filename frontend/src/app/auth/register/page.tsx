"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import Link from "next/link";

type Role = "student" | "teacher";

type FormData = {
  name: string;
  email: string;
  password: string;
  joinCode?: string;
  schoolName?: string;
};

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();
  const [role, setRole] = useState<Role>("student");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [joinCode, setJoinCode] = useState<string | null>(null);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setMessage(null);
    setJoinCode(null);

    try {
      const endpoint =
        role === "student"
          ? `${process.env.NEXT_PUBLIC_API_URL}/auth/register/student`
          : `${process.env.NEXT_PUBLIC_API_URL}/auth/register/teacher`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (res.ok) {
        if (role === "student") {
          setMessage("Registration successful. Waiting for teacher approval.");
        } else {
          setJoinCode(result.joinCode);
        }
        reset();
      } else {
        alert(result.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-blue-400 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Register</h2>

      <div className="flex mb-4">
        <button
          type="button"
          className={`flex-1 py-2 ${
            role === "student" ? "bg-blue-600 text-white" : "bg-gray-500"
          }`}
          onClick={() => {
            setRole("student");
            reset();
          }}
        >
          Student
        </button>
        <button
          type="button"
          className={`flex-1 py-2 ${
            role === "teacher" ? "bg-blue-600 text-white" : "bg-gray-500"
          }`}
          onClick={() => {
            setRole("teacher");
            reset();
          }}
        >
          Teacher
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register("name", { required: true })}
          placeholder="Full Name"
          className="w-full border p-2"
        />
        {errors.name && <span className="text-red-500">Name is required</span>}

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

        {role === "student" && (
          <>
            <input
              {...register("joinCode", { required: true })}
              placeholder="School Join Code"
              className="w-full border p-2"
            />
            {errors.joinCode && (
              <span className="text-red-500">Join code is required</span>
            )}
          </>
        )}

        {role === "teacher" && (
          <>
            <input
              {...register("schoolName", { required: true })}
              placeholder="School Name"
              className="w-full border p-2"
            />
            {errors.schoolName && (
              <span className="text-red-500">School name is required</span>
            )}
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Registering..." : "Register"}
        </button>
        <span>
          Already have an account? <Link href="/login">Login</Link>
        </span>
      </form>

      {/* Messages */}
      {message && (
        <div className="mt-4 p-3 bg-yellow-100 rounded text-black">
          <p>{message}</p>
        </div>
      )}

      {joinCode && (
        <div className="mt-4 p-3 bg-green-100 rounded text-black">
          <p className="font-semibold">School Join Code:</p>
          <p className="text-lg font-mono">{joinCode}</p>
        </div>
      )}
    </div>
  );
}
