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
  Paper,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  ArrowBack as BackIcon,
  ShoppingCart as OrdersIcon,
  LocalShipping as DeliveriesIcon,
  Error as SystemIcon,
  Delete as DeleteIcon,
  MarkEmailUnread as UnreadIcon,
  Launch as ActionIcon,
} from "@mui/icons-material";
import axiosInstance from "@/lib/axios";

interface NotificationEntry {
  id: number;
  category: string;
  title: string;
  message: string;
  created_at: string;
  is_read: boolean;
  type: string;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "order":
      return <OrdersIcon />;
    case "delivery":
      return <DeliveriesIcon />;
    default:
      return <SystemIcon />;
  }
};

const getCategoryColor = (type: string) => {
  switch (type) {
    case "success":
      return "success.main";
    case "warning":
      return "warning.main";
    case "error":
      return "error.main";
    case "info":
      return "info.main";
    default:
      return "primary.main";
  }
};

export default function NotificationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [notification, setNotification] = useState<NotificationEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const response = await axiosInstance.get(`notifications/${id}`);
        setNotification(response.data.notification);

        // Mark as read if it's not
        if (response.data.notification && !response.data.notification.is_read) {
          await axiosInstance.patch(`notifications/${id}/read`);
        }
      } catch (err) {
        console.error("Failed to fetch notification details:", err);
        setError("Impossible de charger les détails de la notification.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotification();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Voulez-vous vraiment supprimer cette notification définitivement ?")) return;
    try {
      await axiosInstance.delete(`notifications/${id}`);
      router.push("/notifications");
    } catch (err) {
      console.error("Failed to delete notification:", err);
      alert("Erreur lors de la suppression.");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !notification) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error || "Notification introuvable."}</Alert>
        <Button startIcon={<BackIcon />} onClick={() => router.push("/notifications")}>
          Retour aux notifications
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <IconButton
          onClick={() => router.push("/notifications")}
          sx={{
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: "12px",
          }}
        >
          <BackIcon />
        </IconButton>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="primary.main">
            Détails de la Notification
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Consultez le contenu complet et gérez l'alerte.
          </Typography>
        </Box>
      </Stack>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card
            elevation={0}
            sx={{
              borderRadius: "20px",
              border: "1px solid",
              borderColor: "divider",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                height: 10,
                bgcolor: getCategoryColor(notification.type),
              }}
            />
            <CardContent sx={{ p: 4 }}>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ mb: 3 }}
              >
                <Avatar
                  sx={{
                    bgcolor: getCategoryColor(notification.type),
                    width: 56,
                    height: 56,
                    borderRadius: "16px",
                  }}
                >
                  {getCategoryIcon(notification.category)}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" fontWeight="bold">
                    {notification.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {notification.category.charAt(0).toUpperCase() +
                      notification.category.slice(1)}{" "}
                    • {new Date(notification.created_at).toLocaleString("fr-FR")}
                  </Typography>
                </Box>
                <Chip
                  label={notification.is_read ? "Lu" : "Nouveau"}
                  color={notification.is_read ? "default" : "primary"}
                  sx={{ fontWeight: "bold", borderRadius: "8px" }}
                />
              </Stack>

              <Divider sx={{ mb: 4 }} />

              <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 4 }}>
                {notification.message}
              </Typography>

              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  startIcon={<ActionIcon />}
                  onClick={() => router.push("/notifications")}
                  sx={{
                    borderRadius: "12px",
                    textTransform: "none",
                    fontWeight: "bold",
                    px: 3,
                    boxShadow: "none",
                  }}
                >
                  Retour à la liste
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>
            <Card
              elevation={0}
              sx={{
                borderRadius: "20px",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Gestion
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Actions pour cette notification.
                </Typography>
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleDelete}
                  sx={{
                    borderRadius: "12px",
                    textTransform: "none",
                    fontWeight: "bold",
                  }}
                >
                  Delete Permanently
                </Button>
              </CardContent>
            </Card>

            <Paper
              variant="outlined"
              sx={{
                p: 3,
                borderRadius: "20px",
                bgcolor: "background.default",
                border: "1px dashed",
                borderColor: "divider",
              }}
            >
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                À propos des Notifications
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ce message a été généré automatiquement par le système YupiFlow.
                Si vous pensez qu'il s'agit d'une erreur, veuillez contacter le support.
              </Typography>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
