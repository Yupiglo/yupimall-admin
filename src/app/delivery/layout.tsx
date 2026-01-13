import type { Metadata } from "next";
import AppShell from "@/components/AppShell";

export default function ModuleLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AppShell>{children}</AppShell>;
}
