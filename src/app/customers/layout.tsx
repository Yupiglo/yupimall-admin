import type { Metadata } from "next";
import AppShell from "@/components/AppShell";

export const metadata: Metadata = {
  title: "Customers | YupiFlow",
  description: "Manage your customer database and relationship.",
};

export default function CustomersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
