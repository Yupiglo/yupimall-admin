"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Stack,
  Button,
  Box,
  Divider,
  MenuItem,
  InputAdornment,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import {
  Save as SaveIcon,
  Security as SecurityIcon,
  MyLocation as LocationIcon,
} from "@mui/icons-material";
import axiosInstance from "@/lib/axios";

interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  gender?: string;
  address?: string;
  city?: string;
  country?: string;
  location?: string; // Maps URL or similar
}

export default function ProfileDetails() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<UserProfile>({
    name: "",
    email: "",
    phone: "",
    bio: "",
    gender: "M",
    address: "",
    city: "",
    country: "",
  });

  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" as "success" | "error" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get("me");
        const user = response.data.user;
        setFormData({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          bio: user.bio || "",
          gender: user.gender || "M",
          address: user.address || "",
          city: user.city || "",
          country: user.country || "",
        });
      } catch (error) {
        console.error("Failed to fetch profile details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axiosInstance.put("me", formData);
      setNotification({ open: true, message: "Profile updated successfully!", severity: "success" });
    } catch (error) {
      console.error("Failed to update profile:", error);
      setNotification({ open: true, message: "Failed to update profile.", severity: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    // This is just a helper for the address field or a separate location field
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // In a real app, you might reverse geocode this. For now, we populate address with coords or similar.
        const coordsString = `${latitude}, ${longitude}`;
        setFormData(prev => ({ ...prev, address: `${prev.address ? prev.address + ' ' : ''}(${coordsString})` }));
      },
      (error) => {
        console.error("Error fetching location:", error);
      }
    );
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
  }

  return (
    <Grid container spacing={4} id="profile-details">
      <Grid size={{ xs: 12, md: 8 }}>
        <Card
          elevation={0}
          sx={{
            borderRadius: "16px",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Personal Information
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Update your personal details and contact information.
            </Typography>

            <Stack spacing={3}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    fullWidth
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Email Address"
                    name="email"
                    value={formData.email}
                    disabled // Email usually shouldn't be changed easily
                    fullWidth
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    select
                    label="Gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    fullWidth
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                  >
                    <MenuItem value="M">Male</MenuItem>
                    <MenuItem value="F">Female</MenuItem>
                    <MenuItem value="O">Other</MenuItem>
                  </TextField>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    fullWidth
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip title="Get current location">
                            <IconButton onClick={handleGetLocation} edge="end">
                              <LocationIcon />
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    fullWidth
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                  />
                </Grid>
              </Grid>

              <TextField
                label="Bio"
                name="bio"
                multiline
                rows={4}
                value={formData.bio}
                onChange={handleChange}
                fullWidth
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />

              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Button
                  variant="contained"
                  startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                  onClick={handleSave}
                  disabled={saving}
                  sx={{
                    borderRadius: "10px",
                    px: 4,
                    textTransform: "none",
                    fontWeight: "bold",
                    boxShadow: "none",
                  }}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Stack spacing={4}>
          <Card
            elevation={0}
            sx={{
              borderRadius: "16px",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <SecurityIcon color="primary" fontSize="small" />
                <Typography variant="subtitle1" fontWeight="bold">
                  Account Security
                </Typography>
              </Stack>
              <Divider sx={{ mb: 3 }} />

              <Stack spacing={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{
                    borderRadius: "10px",
                    textTransform: "none",
                    fontWeight: "bold",
                    justifyContent: "flex-start",
                    py: 1,
                  }}
                >
                  Change Password
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{
                    borderRadius: "10px",
                    textTransform: "none",
                    fontWeight: "bold",
                    justifyContent: "flex-start",
                    py: 1,
                  }}
                >
                  Two-Factor Auth
                </Button>
              </Stack>
            </CardContent>
          </Card>

          <Card
            elevation={0}
            sx={{
              borderRadius: "16px",
              bgcolor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(239, 68, 68, 0.1)"
                  : "#FEF2F2",
              border: "1px solid",
              borderColor: "error.light",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                color="error.main"
                gutterBottom
              >
                Danger Zone
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Once you delete your account, there is no going back.
              </Typography>
              <Button
                fullWidth
                variant="contained"
                color="error"
                sx={{
                  borderRadius: "10px",
                  textTransform: "none",
                  fontWeight: "bold",
                  boxShadow: "none",
                }}
              >
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </Stack>
      </Grid>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Grid>
  );
}
