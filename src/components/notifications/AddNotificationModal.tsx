"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  TextField,
  Typography,
  Stack,
  Box,
  MenuItem,
  Divider,
} from "@mui/material";
import {
  Close as CloseIcon,
  NotificationsActive as NotificationIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";

interface AddNotificationModalProps {
  open: boolean;
  onClose: () => void;
  initialData?: any; // Added for editing
}

const categories = [
  { value: "order", label: "Commande" },
  { value: "delivery", label: "Livraison" },
  { value: "system", label: "Système" },
];

const types = [
  { value: "info", label: "Information" },
  { value: "success", label: "Succès" },
  { value: "warning", label: "Avertissement" },
  { value: "error", label: "Erreur" },
];

const RecipientType = [
  { value: "all", label: "Tous les utilisateurs (Newsbar)" },
  { value: "specific", label: "Utilisateur spécifique" },
];

export default function AddNotificationModal({
  open,
  onClose,
  initialData,
}: AddNotificationModalProps) {
  const [loading, setLoading] = useState(false);
  const [recipientType, setRecipientType] = useState("all");
  const [users, setUsers] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const [formData, setFormData] = useState({
    category: "system",
    type: "info",
    title: "",
    message: "",
    user_id: "" as string | number | null,
  });
  const [isFormDirty, setIsFormDirty] = useState(false);

  const fetchUsers = async (search: string = "") => {
    setSearchLoading(true);
    try {
      const response = await axiosInstance.get(`users?search=${search}&limit=20`);
      setUsers(response.data.getAllUsers || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setSearchLoading(false);
    }
  };

  const fetchLatestBroadcast = async () => {
    try {
      const response = await axiosInstance.get("public/notifications?limit=1");
      const latest = response.data.notifications?.data?.[0];

      // Only pre-fill if the form hasn't been modified by the user
      if (!isFormDirty) {
        if (latest) {
          setFormData(prev => ({
            ...prev,
            title: latest.title || "Newsbar",
            message: latest.message || "",
            category: latest.category || "system",
            type: latest.type || "info",
          }));
        } else {
          // Fallback to default NewsBar message if no notification found
          setFormData(prev => ({
            ...prev,
            title: "Newsbar",
            message: "Livraison gratuite dès 100€ | Nouveautés chaque semaine",
          }));
        }
      }
    } catch (err) {
      console.error("Failed to fetch latest broadcast:", err);
    }
  };

  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({
          category: initialData.category || "system",
          type: initialData.type || "info",
          title: initialData.title || "",
          message: initialData.message || "",
          user_id: initialData.user_id || "",
        });
        setRecipientType(initialData.user_id ? "specific" : "all");
        setIsFormDirty(false); // It's a fresh load of data
      } else {
        if (recipientType === "specific" && users.length === 0) {
          fetchUsers();
        } else if (recipientType === "all") {
          fetchLatestBroadcast();
        }
      }
    }
  }, [recipientType, open, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setIsFormDirty(true);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        title: formData.title,
        message: formData.message,
        category: formData.category,
        type: formData.type,
        user_id: recipientType === "all" ? null : formData.user_id,
      };

      if (initialData?.id) {
        await axiosInstance.put(`notifications/${initialData.id}`, payload);
      } else {
        await axiosInstance.post("notifications", payload);
      }

      onClose();
      // Reset form
      setFormData({ category: "system", type: "info", title: "", message: "", user_id: "" });
      setRecipientType("all");
      setIsFormDirty(false);
    } catch (err) {
      console.error("Failed to process notification:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          backgroundImage: "none",
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 3 }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={{
              bgcolor: "primary.main",
              color: "white",
              p: 1.2,
              borderRadius: "12px",
              display: "flex",
              boxShadow: "0 4px 10px rgba(143, 28, 210, 0.2)",
            }}
          >
            <NotificationIcon sx={{ fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              {initialData ? "Modifier la Notification" : "Nouvelle Notification"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {initialData ? "Mettre à jour le message" : "Envoyer un message aux utilisateurs"}
            </Typography>
          </Box>
        </Stack>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 16,
            top: 24,
            color: "text.secondary",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: 4, pt: 2 }}>
          <Stack spacing={3}>
            <TextField
              select
              label="Destinataire"
              value={recipientType}
              onChange={(e) => setRecipientType(e.target.value)}
              fullWidth
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            >
              {RecipientType.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            {recipientType === "specific" && (
              <TextField
                select
                label="Sélectionner l'utilisateur"
                name="user_id"
                value={formData.user_id}
                onChange={handleChange}
                fullWidth
                required
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                SelectProps={{
                  MenuProps: { PaperProps: { sx: { maxHeight: 300 } } }
                }}
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name || user.username} ({user.email})
                  </MenuItem>
                ))}
                {users.length === 0 && !searchLoading && (
                  <MenuItem disabled>Aucun utilisateur trouvé</MenuItem>
                )}
                {searchLoading && (
                  <MenuItem disabled>Chargement...</MenuItem>
                )}
              </TextField>
            )}

            <Divider />

            <TextField
              select
              label="Catégorie"
              name="category"
              value={formData.category}
              onChange={handleChange}
              fullWidth
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            >
              {categories.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Type de notification"
              name="type"
              value={formData.type}
              onChange={handleChange}
              fullWidth
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            >
              {types.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Titre"
              name="title"
              value={formData.title}
              onChange={handleChange}
              fullWidth
              required
              placeholder="ex: Alerte Maintenance"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />

            <TextField
              label="Message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              fullWidth
              required
              multiline
              rows={4}
              placeholder="Entrez le message détaillé..."
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={onClose}
            disabled={loading}
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: "bold",
              px: 3,
              color: "text.secondary",
            }}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            variant="contained"
            endIcon={<SendIcon />}
            disabled={loading || !formData.title || !formData.message || (recipientType === 'specific' && !formData.user_id)}
            sx={{
              borderRadius: "10px",
              px: 4,
              textTransform: "none",
              fontWeight: "bold",
              boxShadow: "none",
            }}
          >
            {loading ? "Traitement..." : initialData ? "Mettre à jour" : "Envoyer la Notification"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
