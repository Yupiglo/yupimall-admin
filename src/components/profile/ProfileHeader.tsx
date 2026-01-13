"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  Stack,
  Button,
  Card,
  CardContent,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  PhotoCamera as CameraIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import axiosInstance from "@/lib/axios";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
  image_url?: string;
  avatar_url?: string; // Handle both naming conventions if needed
}

export default function ProfileHeader() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get("me");
        setUser(response.data.user);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <Card
        elevation={0}
        sx={{
          borderRadius: "16px",
          border: "1px solid",
          borderColor: "divider",
          mb: 4,
          height: 250,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Card>
    );
  }

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: "16px",
        border: "1px solid",
        borderColor: "divider",
        overflow: "visible",
        position: "relative",
        mb: 4,
      }}
    >
      <Box
        sx={{
          height: 160,
          borderRadius: "16px 16px 0 0",
          background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
        }}
      />
      <CardContent sx={{ pt: 0, pb: 3, px: 4 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={3}
          alignItems={{ xs: "center", sm: "flex-end" }}
          sx={{ mt: -6 }}
        >
          <Box sx={{ position: "relative" }}>
            <Avatar
              src={user?.image_url || user?.avatar_url}
              alt={user?.name}
              sx={{
                width: 120,
                height: 120,
                border: "4px solid",
                borderColor: "background.paper",
                boxShadow: (theme) => theme.shadows[3],
                bgcolor: "primary.main",
                fontSize: "3rem",
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
            <IconButton
              sx={{
                position: "absolute",
                bottom: 4,
                right: 4,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                "&:hover": { bgcolor: "action.hover" },
                width: 32,
                height: 32,
              }}
              size="small"
            >
              <CameraIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>

          <Box
            sx={{ flexGrow: 1, textAlign: { xs: "center", sm: "left" }, pb: 1 }}
          >
            <Typography variant="h5" fontWeight="bold">
              {user?.name || "User"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.role?.toUpperCase()} | Member since{" "}
              {user?.created_at
                ? new Date(user.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })
                : "..."}
            </Typography>
          </Box>

          <Stack direction="row" spacing={2} sx={{ pb: 1 }}>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => {
                const detailsSection = document.getElementById("profile-details");
                if (detailsSection) {
                  detailsSection.scrollIntoView({ behavior: "smooth" });
                }
              }}
              sx={{
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: "bold",
              }}
            >
              Edit Profile
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
