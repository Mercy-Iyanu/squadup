"use client";

import { format } from "date-fns";
import clsx from "clsx";

type Student = {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  status: "pending" | "approved" | "rejected";
};

type Props = {
  student: Student;
  onChangeStatus: (id: string, status: "approved" | "rejected") => void;
};

export default function StudentRow({ student, onChangeStatus }: Props) {
  const statusStyles = clsx(
    "px-3 py-1 rounded-full text-sm font-medium capitalize",
    {
      "bg-yellow-100 text-yellow-800": student.status === "pending",
      "bg-green-100 text-green-800": student.status === "approved",
      "bg-red-100 text-red-800": student.status === "rejected",
    }
  );

  const isFinal = student.status !== "pending";

  return (
    <tr className="border-b hover:bg-gray-50 transition">
      <td className="py-2 px-4">{student.name}</td>
      <td className="py-2 px-4">{student.email}</td>
      <td className="py-2 px-4">
        <span className={statusStyles}>{student.status}</span>
      </td>
      <td className="py-2 px-4">{format(new Date(student.createdAt), "PP")}</td>
      <td className="py-2 px-4 text-center">
        <select
          defaultValue=""
          onChange={(e) => {
            const value = e.target.value as "approved" | "rejected";
            if (value) onChangeStatus(student._id, value);
          }}
          disabled={isFinal}
          className={clsx("border rounded px-2 py-1 text-sm transition", {
            "bg-gray-100 text-gray-500 cursor-not-allowed": isFinal,
          })}
        >
          <option value="">Select...</option>
          <option value="approved" disabled={student.status === "approved"}>
            Approve
          </option>
          <option value="rejected" disabled={student.status === "rejected"}>
            Reject
          </option>
        </select>
      </td>
    </tr>
  );
}
