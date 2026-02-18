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
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  Print as PrintIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useActiveDeliveries } from "@/hooks/useDeliveries";

export default function DeliveriesTable() {
  const router = useRouter();
  const { deliveries, loading, error } = useActiveDeliveries();

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase();
    if (s === "delivered" || s === "livré") return "success";
    if (s === "in transit" || s === "en transit" || s === "in_transit") return "info";
    if (s === "pending" || s === "en attente") return "warning";
    if (s === "cancelled" || s === "annulé") return "error";
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

  if (deliveries.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 6 }}>
        <Typography color="text.secondary">Aucune livraison trouvée</Typography>
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
            <TableCell sx={{ fontWeight: "bold" }}>ID Livraison</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Commande & Client</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Livreur</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Adresse</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Statut</TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {deliveries.map((delivery) => (
            <TableRow key={delivery.id} hover sx={{ "&:last-child td": { border: 0 } }}>
              <TableCell sx={{ fontWeight: "medium" }}>#{delivery.id}</TableCell>
              <TableCell>
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">{delivery.orderId}</Typography>
                  <Typography variant="caption" color="text.secondary">{delivery.customer}</Typography>
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: "medium" }}>{delivery.courier}</TableCell>
              <TableCell
                sx={{
                  color: "text.secondary", maxWidth: 200,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}
              >
                {delivery.address}
              </TableCell>
              <TableCell sx={{ color: "text.secondary" }}>
                {delivery.date ? new Date(delivery.date).toLocaleDateString("fr-FR") : "—"}
              </TableCell>
              <TableCell>
                <Chip
                  label={delivery.status}
                  color={getStatusColor(delivery.status) as any}
                  size="small"
                  variant="outlined"
                  sx={{ fontWeight: 500, borderRadius: "100px", px: 0.5 }}
                />
              </TableCell>
              <TableCell align="right">
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <Tooltip title="Voir détails">
                    <IconButton size="small" onClick={() => router.push(`/deliveries/${delivery.id}`)}>
                      <ViewIcon fontSize="small" color="action" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Imprimer">
                    <IconButton size="small" color="primary" onClick={() => router.push(`/deliveries/${delivery.id}?print=true`)}>
                      <PrintIcon fontSize="small" />
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
