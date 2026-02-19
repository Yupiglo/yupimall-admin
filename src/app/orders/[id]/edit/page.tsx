"use client";

import { use, useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  IconButton,
  Button,
  TextField,
  Grid,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import {
  ArrowBack as BackIcon,
  Save as SaveIcon,
  Receipt as OrderIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { LinksEnum } from "@/utilities/pagesLinksEnum";
import { useOrderDetail } from "@/hooks/useOrderDetail";
import { CurrencyContext } from "@/helpers/currency/CurrencyContext";

// Statuts alignés avec la page de suivi (3 étapes) + workflow complet
const STATUS_OPTIONS = [
  { value: "pending", label: "En attente", step: 1 },
  { value: "validated", label: "Confirmée", step: 1 },
  { value: "reached_warehouse", label: "Au dépôt", step: 2 },
  { value: "shipped_to_stockist", label: "En transit", step: 2 },
  { value: "reached_stockist", label: "Chez stockiste", step: 2 },
  { value: "out_for_delivery", label: "En livraison", step: 2 },
  { value: "shipped", label: "Expédiée", step: 2 },
  { value: "delivered", label: "Livrée", step: 3 },
  { value: "canceled", label: "Annulée", step: 0 },
];

export default function OrderEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const decodedId = decodeURIComponent(id);

  const { order, loading, updating, updateStatus, refresh } = useOrderDetail(decodedId);
  const currencyContext = useContext(CurrencyContext) as { selectedCurr?: { value: number; symbol: string } } | null;
  const currValue = currencyContext?.selectedCurr?.value ?? 1;
  const currSymbol = currencyContext?.selectedCurr?.symbol ?? "$";

  const [formData, setFormData] = useState({
    status: "",
    notes: "",
  });

  useEffect(() => {
    if (order) {
      setFormData((prev) => ({
        ...prev,
        status: order.status || "pending",
        notes: (order as any).notes || "",
      }));
    }
  }, [order]);

  const formatPrice = (priceUSD: number) => {
    const converted = priceUSD * currValue;
    if (currSymbol === "FCFA" || currSymbol === "₦") {
      return `${Math.round(converted).toLocaleString()} ${currSymbol}`;
    }
    return `${currSymbol}${converted.toFixed(2)}`;
  };

  const handleSave = async () => {
    const ok = await updateStatus(formData.status);
    if (ok) {
      await refresh();
      router.push(`/orders/${encodeURIComponent(decodedId)}`);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!order) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          Commande introuvable
        </Typography>
        <Button variant="contained" onClick={() => router.push(LinksEnum.orders)} sx={{ mt: 2, borderRadius: 3 }}>
          Retour aux commandes
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, maxWidth: 1200, mx: "auto" }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <IconButton
          onClick={() => router.push(`/orders/${encodeURIComponent(decodedId)}`)}
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
            Modifier #{order.trackingCode}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Mettre à jour le statut de la commande (aligné avec le suivi client).
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={updating ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
          onClick={handleSave}
          disabled={updating}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: "bold",
            px: 4,
            boxShadow: "none",
          }}
        >
          Enregistrer
        </Button>
      </Stack>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            elevation={0}
            sx={{
              borderRadius: "20px",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                <OrderIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Statut de la commande
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Les 3 étapes du suivi client : Confirmée → Expédiée → Livrée
              </Typography>
              <TextField
                select
                fullWidth
                label="Statut"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            elevation={0}
            sx={{
              borderRadius: "20px",
              border: "1px solid",
              borderColor: "divider",
              height: "100%",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Résumé de la commande
              </Typography>
              <Stack spacing={1.5} sx={{ mt: 2 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Client
                  </Typography>
                  <Typography variant="body2" fontWeight="600">
                    {order.customer || "—"}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Articles
                  </Typography>
                  <Typography variant="body2" fontWeight="600">
                    {order.items?.length || 0} article(s)
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Total
                  </Typography>
                  <Typography variant="body2" fontWeight="700" color="primary.main">
                    {formatPrice(order.total || 0)}
                  </Typography>
                </Stack>
              </Stack>
              <Button
                component={Link}
                href={`${process.env.NEXT_PUBLIC_YUPIMALL_URL || "https://yupimall.net"}/track?code=${encodeURIComponent(order.trackingCode || "")}`}
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined"
                fullWidth
                sx={{ mt: 3, borderRadius: "12px" }}
              >
                Voir le suivi client
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
