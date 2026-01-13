"use client";

import { signOut } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    signOut();
    router.push("/login");
  }, []);

  return;
}
