import DashboardLayout from "@/components/DashboardLayout";

export default function InternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
