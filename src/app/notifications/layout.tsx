import type { Metadata } from "next";
import AppShell from "@/components/AppShell";

export const metadata: Metadata = {
  title: "Notifications | YupiFlow",
  description: "Stay updated with your daily operations.",
};

export default function NotificationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
