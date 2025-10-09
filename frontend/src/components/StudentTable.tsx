"use client";

import StudentRow from "./StudentRow";

type Student = {
  _id: string;
  name: string;
  email: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};

type Props = {
  students: Student[];
  onChangeStatus: (id: string, status: "approved" | "rejected") => void;
};

export default function StudentTable({ students, onChangeStatus }: Props) {
  return (
    <table className="min-w-full bg-white text-black border rounded-lg shadow-md">
      <thead>
        <tr className="bg-gray-100 border-b">
          <th className="py-2 px-4 text-left">Name</th>
          <th className="py-2 px-4 text-left">Email</th>
          <th className="py-2 px-4 text-left">Status</th>
          <th className="py-2 px-4 text-left">Registered</th>
          <th className="py-2 px-4 text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        {students.map((student) => (
          <StudentRow
            key={student._id}
            student={student}
            onChangeStatus={onChangeStatus}
          />
        ))}
      </tbody>
    </table>
  );
}
