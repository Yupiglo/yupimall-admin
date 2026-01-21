"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
  Stack,
  Tooltip,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
  country?: string;
  created_at?: string;
}

export default function CustomersTable() {
  const router = useRouter();
  const [customers, setCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("users");
        // Handle different API response formats
        let allUsers: User[] = [];
        if (Array.isArray(response.data)) {
          allUsers = response.data;
        } else if (response.data?.users && Array.isArray(response.data.users)) {
          allUsers = response.data.users;
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          allUsers = response.data.data;
        }
        // Filter users (excluding super\_admin, dev, webmaster to keep it focused on external roles)
        const relevantUsers = allUsers.filter(
          (u: User) => ["consumer", "warehouse", "stockist"].includes(u.role) || !u.role
        );
        setCustomers(relevantUsers);
      } catch (err: any) {
        console.error("Failed to fetch customers:", err);
        setError("Impossible de charger les clients");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
      case "super_admin":
        return "error";
      case "webmaster":
        return "warning";
      case "dev":
        return "info";
      default:
        return "default";
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer ce client ?")) return;
    try {
      await axiosInstance.delete(`users/${id}`);
      setCustomers((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Failed to delete customer:", err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Stack spacing={2}>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ borderRadius: "16px", border: "1px solid", borderColor: "divider" }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: "background.default" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Client</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Pays</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Inscription</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    Aucun client trouvé
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {customers.map((customer) => (
              <TableRow
                key={customer.id}
                hover
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: "primary.light",
                        color: "primary.main",
                        fontWeight: "bold",
                      }}
                    >
                      {(customer.name || customer.username || "?").charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {customer.name || customer.username}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: #{customer.id}
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{customer.email}</Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={customer.country || "Non défini"}
                    size="small"
                    variant="outlined"
                    sx={{ borderRadius: "6px" }}
                  />
                </TableCell>
                <TableCell sx={{ color: "text.secondary" }}>
                  {customer.created_at
                    ? new Date(customer.created_at).toLocaleDateString("fr-FR")
                    : "N/A"}
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Tooltip title="Voir détails">
                      <IconButton
                        size="small"
                        onClick={() => router.push(`/customers/${customer.id}`)}
                      >
                        <ViewIcon fontSize="small" color="action" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Modifier">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => router.push(`/customers/${customer.id}/edit`)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(customer.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="body2" color="text.secondary" sx={{ textAlign: "right" }}>
        {customers.length} client(s) trouvé(s)
      </Typography>
    </Stack>
  );
}
