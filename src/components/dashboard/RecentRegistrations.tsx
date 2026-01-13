"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  created_at: string;
}

export default function RecentRegistrations() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get("users");
        const allUsers = response.data.users || response.data || [];
        // Sort by created_at descending and take 5 most recent
        const sorted = allUsers
          .sort(
            (a: User, b: User) =>
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )
          .slice(0, 5);
        setUsers(sorted);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return date.toLocaleDateString("fr-FR");
  };

  return (
    <Card
      sx={{
        borderRadius: 4,
        border: "1px solid #f3f4f6",
        boxShadow: "none",
        height: "100%",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <Typography variant="h6" fontWeight="bold" color="text.primary">
            Inscriptions Récentes
          </Typography>
          <Button
            variant="text"
            size="small"
            onClick={() => router.push("/customers")}
            sx={{
              color: "text.secondary",
              textTransform: "none",
              fontSize: "0.75rem",
              "&:hover": { color: "primary.main" },
            }}
          >
            Voir tout
          </Button>
        </Stack>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress size={32} />
          </Box>
        ) : users.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              py: 4,
              bgcolor: "#f9fafb",
              borderRadius: 3,
            }}
          >
            <Typography sx={{ fontSize: "2rem", mb: 1 }}>👤</Typography>
            <Typography color="text.secondary" variant="body2">
              Aucune inscription récente
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {users.map((user) => (
              <Stack
                key={user.id}
                direction="row"
                alignItems="center"
                spacing={2}
                sx={{
                  py: 1,
                  borderBottom: "1px solid #f9fafb",
                  "&:last-child": { borderBottom: "none" },
                }}
              >
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: "primary.light",
                    color: "primary.main",
                    fontWeight: "bold",
                  }}
                >
                  {(user.name || user.username || "?").charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" fontWeight="medium">
                    {user.name || user.username}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatTimeAgo(user.created_at)}
                  </Typography>
                </Box>
              </Stack>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
