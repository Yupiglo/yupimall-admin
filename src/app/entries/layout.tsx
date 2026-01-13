import type { Metadata } from "next";
import AppShell from "@/components/AppShell";

export const metadata: Metadata = {
  title: "Stock Entries | YupiFlow",
  description: "Track and manage incoming inventory.",
};

export default function EntriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
