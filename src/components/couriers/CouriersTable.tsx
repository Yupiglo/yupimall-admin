"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Typography,
  Box,
  Stack,
  Tooltip,
  Avatar,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useDeliveryPersonnel } from "@/hooks/useDeliveries";

export default function CouriersTable() {
  const router = useRouter();
  const { personnel, loading, error } = useDeliveryPersonnel();

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase();
    if (s === "active") return "success";
    if (s === "on delivery" || s === "on_delivery") return "info";
    return "default";
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>;
  }

  if (personnel.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 6 }}>
        <Typography color="text.secondary">Aucun livreur trouvé</Typography>
      </Box>
    );
  }

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{ borderRadius: "16px", border: "1px solid", borderColor: "divider" }}
    >
      <Table sx={{ minWidth: 650 }}>
        <TableHead sx={{ bgcolor: "background.default" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Livreur</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Contact</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Véhicule</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Livraisons</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Statut</TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {personnel.map((courier) => (
            <TableRow key={courier.id} hover sx={{ "&:last-child td": { border: 0 } }}>
              <TableCell>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    sx={{
                      width: 40, height: 40, bgcolor: "primary.light",
                      color: "primary.main", fontWeight: "bold",
                    }}
                  >
                    {courier.name?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">{courier.name}</Typography>
                    <Typography variant="caption" color="text.secondary">#{courier.id}</Typography>
                  </Box>
                </Stack>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="body2">{courier.email}</Typography>
                  <Typography variant="caption" color="text.secondary">{courier.phone}</Typography>
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: "medium" }}>{courier.vehicle || "—"}</TableCell>
              <TableCell sx={{ fontWeight: "medium" }}>{courier.totalDeliveries ?? 0}</TableCell>
              <TableCell>
                <Chip
                  label={courier.status}
                  color={getStatusColor(courier.status) as any}
                  size="small"
                  variant="outlined"
                />
              </TableCell>
              <TableCell align="right">
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <Tooltip title="Voir le profil">
                    <IconButton size="small" onClick={() => router.push(`/couriers/${courier.id}`)}>
                      <ViewIcon fontSize="small" color="action" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Modifier">
                    <IconButton size="small" color="primary" onClick={() => router.push(`/couriers/${courier.id}/edit`)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Supprimer">
                    <IconButton size="small" color="error">
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
  );
}
