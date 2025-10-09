"use client";

import StudentRow from "./StudentRow";

type Student = {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
};

type Props = {
  students: Student[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
};

export default function StudentTable({ students, onApprove, onReject }: Props) {
  return (
    <table className="min-w-full bg-white text-black border rounded-lg shadow-md">
      <thead>
        <tr className="bg-gray-100 border-b">
          <th className="py-2 px-4 text-left">Name</th>
          <th className="py-2 px-4 text-left">Email</th>
          <th className="py-2 px-4 text-left">Registered</th>
          <th className="py-2 px-4 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {students.map((student) => (
          <StudentRow
            key={student._id}
            student={student}
            onApprove={onApprove}
            onReject={onReject}
          />
        ))}
      </tbody>
    </table>
  );
}
