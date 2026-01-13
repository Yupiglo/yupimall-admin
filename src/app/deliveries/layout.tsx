import type { Metadata } from "next";
import AppShell from "@/components/AppShell";

export const metadata: Metadata = {
  title: "Deliveries | YupiFlow",
  description: "Manage and track your delivery logistics.",
};

export default function DeliveriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
