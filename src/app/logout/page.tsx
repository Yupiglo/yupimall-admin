"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import axios from "axios";

export default function LogoutPage() {
  const { data: session } = useSession();
  const hasLoggedOut = useRef(false);

  useEffect(() => {
    // Prevent multiple logout attempts
    if (hasLoggedOut.current) return;
    hasLoggedOut.current = true;

    const performLogout = async () => {
      // Try to revoke the token on the backend using raw axios (no interceptors)
      if (session?.accessToken) {
        try {
          await axios.post(
            "/api/v1/auth/logout",
            {},
            {
              headers: {
                Authorization: `Bearer ${session.accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );
        } catch (error) {
          // Ignore errors - we're logging out anyway
          console.log("Backend logout call failed, continuing with frontend logout");
        }
      }

      // Sign out from NextAuth and redirect to login
      await signOut({ callbackUrl: "/login", redirect: true });
    };

    performLogout();
  }, [session]);

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      fontFamily: "sans-serif"
    }}>
      <p>Logging out...</p>
    </div>
  );
}
