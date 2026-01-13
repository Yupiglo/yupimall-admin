import type { Metadata } from "next";
import AppShell from "@/components/AppShell";

export const metadata: Metadata = {
  title: "Managers | YupiFlow",
  description: "Manage permissions and administrative access.",
};

export default function ManagersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
