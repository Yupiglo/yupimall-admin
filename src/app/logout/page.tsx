"use client";

import { signOut } from "next-auth/react";
import { useEffect } from "react";
import axiosInstance from "@/lib/axios";

export default function LogoutPage() {
  useEffect(() => {
    const performLogout = async () => {
      try {
        await axiosInstance.post("auth/logout");
      } catch (error) {
        console.error("Failed to revoke token on backend:", error);
      } finally {
        signOut({ callbackUrl: "/login" });
      }
    };

    performLogout();
  }, []);

  return null;
}
