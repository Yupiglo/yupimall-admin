"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  IconButton,
  Button,
  Avatar,
  Chip,
  Divider,
  Grid,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  ArrowBack as BackIcon,
  Edit as EditIcon,
  Security as SecurityIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  AdminPanelSettings as AdminIcon,
} from "@mui/icons-material";
import axiosInstance from "@/lib/axios";

const modulePermissions = [
  { module: "Products", access: "View / Create / Edit" },
  { module: "Orders", access: "Full Access" },
  { module: "Entries", access: "View Only" },
  { module: "Exits", access: "View Only" },
  { module: "Deliveries", access: "Full Access" },
  { module: "Couriers", access: "View / Edit" },
  { module: "Customers", access: "View / Create" },
];

export default function ManagerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const decodedId = decodeURIComponent(id);

  const [manager, setManager] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchManager = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get(`users/${decodedId}`);
        if (response.data.message === 'success') {
          const userData = response.data.user;
          setManager({
            id: `#MGR-${userData.id}`,
            name: userData.name || 'Unknown',
            email: userData.email || 'Not provided',
            role: userData.role || 'Manager',
            status: userData.status || 'Active',
            lastLogin: userData.last_login 
              ? new Date(userData.last_login).toLocaleString('en-US', { 
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                }) + ' ago'
              : 'Never',
            phone: userData.phone || 'Not provided',
          });
        }
      } catch (err) {
        console.error("Error fetching manager:", err);
        setError("Failed to load manager details");
      } finally {
        setLoading(false);
      }
    };

    if (decodedId) {
      fetchManager();
    }
  }, [decodedId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !manager) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || "Manager not found"}
        </Alert>
        <Button variant="contained" onClick={() => router.push("/managers")}>
          Back to Managers
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <IconButton
          onClick={() => router.push("/managers")}
          sx={{
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: "12px",
          }}
        >
          <BackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" fontWeight="bold" color="primary.main">
            Manager Profile
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Viewing detailed information and access levels.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => router.push(`/managers/${id}/edit`)}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: "bold",
            px: 3,
            boxShadow: "none",
          }}
        >
          Edit Manager
        </Button>
      </Stack>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>
            <Card
              elevation={0}
              sx={{
                borderRadius: "20px",
                border: "1px solid",
                borderColor: "divider",
                textAlign: "center",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    mx: "auto",
                    mb: 2,
                    bgcolor: "primary.light",
                    color: "primary.main",
                    fontSize: "3rem",
                    fontWeight: "bold",
                    border: "4px solid",
                    borderColor: "background.paper",
                    boxShadow: (theme) => theme.shadows[3],
                  }}
                >
                  {manager.name.charAt(0)}
                </Avatar>
                <Typography variant="h5" fontWeight="bold">
                  {manager.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {manager.id}
                </Typography>
                <Chip
                  label={manager.role}
                  color={manager.role === "Admin" ? "error" : "primary"}
                  size="small"
                  sx={{ mt: 1, fontWeight: "bold", borderRadius: "6px" }}
                />
              </CardContent>
            </Card>

            <Card
              elevation={0}
              sx={{
                borderRadius: "20px",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{ mb: 2 }}
                >
                  Contact Information
                </Typography>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <EmailIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        Email Address
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {manager.email}
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <PhoneIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        Phone Number
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {manager.phone}
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card
            elevation={0}
            sx={{
              borderRadius: "20px",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 3 }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <SecurityIcon color="primary" />
                  <Typography variant="h6" fontWeight="bold">
                    Modular Permissions
                  </Typography>
                </Stack>
                <Chip
                  icon={<AdminIcon sx={{ fontSize: "1rem !important" }} />}
                  label="Verified Access"
                  color="success"
                  variant="outlined"
                  size="small"
                  sx={{ borderRadius: "8px", fontWeight: "bold" }}
                />
              </Stack>

              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                {modulePermissions.map((perm) => (
                  <Grid key={perm.module} size={{ xs: 12, sm: 6 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: "12px",
                        bgcolor: "background.default",
                        border: "1px solid",
                        borderColor: "divider",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography fontWeight="bold">{perm.module}</Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "primary.main", fontWeight: "bold" }}
                      >
                        {perm.access}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              <Box
                sx={{
                  mt: 4,
                  p: 3,
                  borderRadius: "16px",
                  bgcolor: "rgba(79, 70, 229, 0.04)",
                  border: "1px dashed",
                  borderColor: "primary.light",
                }}
              >
                <Typography
                  variant="subtitle2"
                  fontWeight="bold"
                  color="primary.main"
                  gutterBottom
                >
                  Administrative Note
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Permissions are inherited from the general "{manager.role}"
                  role but have been fine-tuned for module-specific activities.
                  Last permission update: 2 days ago.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
