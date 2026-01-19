import { Metadata } from "next";
import AppShell from "@/components/AppShell";

export const metadata: Metadata = {
    title: "Registrations | YupiFlow",
};

export default function RegistrationsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AppShell>{children}</AppShell>;
}
