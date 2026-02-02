"use client";

import { useState, useEffect, useRef } from "react";
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
  Snackbar,
  Alert,
} from "@mui/material";
import {
  PhotoCamera as CameraIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import axiosInstance from "@/lib/axios";
import { useSession } from "next-auth/react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
  image_url?: string;
  avatar_url?: string;
}

export default function ProfileHeader() {
  const { data: session, update } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" as "success" | "error" });
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    fetchUser();
  }, []);

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith('image/')) {
      setNotification({ open: true, message: "Please select an image file", severity: "error" });
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      const response = await axiosInstance.post("me/avatar", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const updatedUser = response.data.user;
      setUser(updatedUser);

      // Update NextAuth session to reflect change in Header
      await update({
        ...session,
        user: {
          ...session?.user,
          image: response.data.image_url,
        },
      });

      setNotification({ open: true, message: "Avatar updated successfully!", severity: "success" });
    } catch (error: any) {
      console.error("Failed to upload avatar:", error);
      setNotification({ open: true, message: error.response?.data?.message || "Failed to upload avatar", severity: "error" });
    } finally {
      setUploading(false);
    }
  };

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

  const getFullImageUrl = (path: string | undefined) => {
    if (!path) return undefined;
    if (path.startsWith('http')) return path;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.yupimall.net";
    return `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  };

  return (
    <>
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
                src={getFullImageUrl(user?.image_url || user?.avatar_url)}
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
                {uploading ? <CircularProgress size={40} color="inherit" /> : user?.name?.charAt(0).toUpperCase()}
              </Avatar>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <IconButton
                onClick={handleCameraClick}
                disabled={uploading}
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

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
}
