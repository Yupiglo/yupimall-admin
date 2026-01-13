"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Box,
  Typography,
  Stack,
  Card,
  IconButton,
  Button,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  ShoppingCart as OrdersIcon,
  LocalShipping as DeliveriesIcon,
  Error as SystemIcon,
  MoreVert as MoreIcon,
  CheckCircle as ReadIcon,
  NotificationAdd as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import AddNotificationModal from "@/components/notifications/AddNotificationModal";
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

export default function NotificationsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [filter, setFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [latestBroadcast, setLatestBroadcast] = useState<any>(null);

  // States for actions menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeNotif, setActiveNotif] = useState<NotificationEntry | null>(null);
  const [editNotif, setEditNotif] = useState<NotificationEntry | null>(null);

  const fetchNotifications = async () => {
    if (!session?.user) return;
    setLoading(true);
    try {
      const [notifsRes, broadcastRes] = await Promise.all([
        axiosInstance.get(`notifications?category=${filter}`),
        axiosInstance.get("public/notifications?limit=1")
      ]);
      setNotifications(notifsRes.data.notifications.data);
      setLatestBroadcast(broadcastRes.data.notifications?.data?.[0] || null);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      setError("Erreur lors du chargement des notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchNotifications();
    }
  }, [session, filter]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, notification: NotificationEntry) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setActiveNotif(notification);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActiveNotif(null);
  };

  const handleDelete = async () => {
    if (!activeNotif) return;
    try {
      await axiosInstance.delete(`notifications/${activeNotif.id}`);
      setNotifications(prev => prev.filter(n => n.id !== activeNotif.id));
      if (latestBroadcast?.id === activeNotif.id) {
        setLatestBroadcast(null);
      }
    } catch (err) {
      console.error("Failed to delete notification:", err);
      setError("Erreur lors de la suppression.");
    } finally {
      handleMenuClose();
    }
  };

  const handleEditOpen = () => {
    setEditNotif(activeNotif);
    setIsModalOpen(true);
    handleMenuClose();
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditNotif(null);
    fetchNotifications(); // Refresh list after add/edit
  };

  const markAllRead = async () => {
    try {
      await axiosInstance.post("notifications/mark-all-read");
      fetchNotifications();
    } catch (err) {
      console.error("Failed to mark all read:", err);
    }
  };

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
    <Box sx={{ flexGrow: 1 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 4 }}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight="bold"
            color="primary.main"
            gutterBottom
          >
            Notifications
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Restez informé de toutes les activités système en temps réel.
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={() => setIsModalOpen(true)}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: "bold",
              boxShadow: "none",
            }}
          >
            Ajouter Notification
          </Button>
          <Button
            startIcon={<ReadIcon />}
            variant="outlined"
            size="medium"
            onClick={markAllRead}
            sx={{ borderRadius: "12px", textTransform: "none" }}
          >
            Tout marquer comme lu
          </Button>
        </Stack>
      </Stack>

      <AddNotificationModal
        open={isModalOpen}
        onClose={handleModalClose}
        initialData={editNotif}
      />

      {/* Global Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            minWidth: 160,
            boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
          },
        }}
      >
        <MenuItem onClick={handleEditOpen}>
          <ListItemIcon>
            <EditIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText primary="Modifier" />
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primary="Supprimer" />
        </MenuItem>
      </Menu>

      <Stack direction="row" spacing={1} sx={{ mb: 4 }}>
        {["all", "order", "delivery", "system"].map((cat) => (
          <Chip
            key={cat}
            label={cat.charAt(0).toUpperCase() + cat.slice(1)}
            onClick={() => setFilter(cat)}
            variant={filter === cat ? "filled" : "outlined"}
            color={filter === cat ? "primary" : "default"}
            sx={{
              borderRadius: "8px",
              fontWeight: "bold",
              px: 1,
            }}
          />
        ))}
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

      {latestBroadcast && (
        <Box
          sx={{
            mb: 4,
            p: 2.5,
            borderRadius: "16px",
            bgcolor: "primary.main",
            display: "flex",
            alignItems: "center",
            gap: 2,
            boxShadow: "0 6px 15px rgba(143, 28, 210, 0.25)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(255, 255, 255, 0.2)",
              borderRadius: "10px",
              p: 1,
            }}
          >
            <NotificationsIcon sx={{ color: "white", fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ color: "white", mb: 0.2 }}>
              Message actuel de la Newsbar :
            </Typography>
            <Typography variant="body2" sx={{ color: "white", opacity: 0.95 }}>
              "{latestBroadcast.message}"
            </Typography>
          </Box>
        </Box>
      )}

      <Card
        variant="outlined"
        sx={{ borderRadius: "16px", overflow: "hidden" }}
      >
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {notifications.map((notification, index) => (
              <Box key={notification.id}>
                <ListItem
                  alignItems="flex-start"
                  onClick={() => router.push(`/notifications/${notification.id}`)}
                  sx={{
                    p: 3,
                    bgcolor: notification.is_read
                      ? "transparent"
                      : "rgba(143, 28, 210, 0.04)",
                    transition: "all 0.2s",
                    "&:hover": {
                      bgcolor: notification.is_read
                        ? "action.hover"
                        : "rgba(143, 28, 210, 0.08)",
                      cursor: "pointer",
                    },
                  }}
                  secondaryAction={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="caption" color="text.secondary">
                        {formatTimeAgo(notification.created_at)}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, notification)}
                      >
                        <MoreIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  }
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: getCategoryColor(notification.type),
                        width: 44,
                        height: 44,
                        borderRadius: "12px",
                      }}
                    >
                      {getCategoryIcon(notification.category)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography
                        variant="subtitle1"
                        fontWeight={notification.is_read ? "medium" : "bold"}
                        color="text.primary"
                      >
                        {notification.title}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5, pr: 8 }}
                      >
                        {notification.message}
                      </Typography>
                    }
                  />
                  {!notification.is_read && (
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: "primary.main",
                        position: "absolute",
                        left: 8,
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                    />
                  )}
                </ListItem>
                {index < notifications.length - 1 && <Divider />}
              </Box>
            ))}
            {notifications.length === 0 && (
              <Box sx={{ textAlign: "center", py: 8 }}>
                <NotificationsIcon
                  sx={{ fontSize: 64, color: "text.disabled", mb: 2 }}
                />
                <Typography variant="h6" color="text.secondary">
                  Aucune notification trouvée.
                </Typography>
              </Box>
            )}
          </List>
        )}
      </Card>
    </Box>
  );
}
