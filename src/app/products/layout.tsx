import type { Metadata } from "next";
import AppShell from "@/components/AppShell";

export const metadata: Metadata = {
  title: "Products | YupiFlow",
  description: "Manage your inventory and product details.",
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
