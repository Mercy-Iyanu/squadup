"use client";

import { format } from "date-fns";

type Student = {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
};

type Props = {
  student: Student;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
};

export default function StudentRow({ student, onApprove, onReject }: Props) {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="py-2 px-4">{student.name}</td>
      <td className="py-2 px-4">{student.email}</td>
      <td className="py-2 px-4">{format(new Date(student.createdAt), "PP")}</td>
      <td className="py-2 px-4 text-center space-x-2">
        <button
          onClick={() => onApprove(student._id)}
          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
        >
          Approve
        </button>
        <button
          onClick={() => onReject(student._id)}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
        >
          Reject
        </button>
      </td>
    </tr>
  );
}
