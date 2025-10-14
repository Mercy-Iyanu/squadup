import TopNav from "@/components/TopNav";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen pt-16">
        {" "}
        <TopNav />
        <main className="mt-6">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
