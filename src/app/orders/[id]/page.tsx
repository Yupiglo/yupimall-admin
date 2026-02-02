"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  IconButton,
  Button,
  Chip,
  Divider,
  Grid,
  Breadcrumbs,
  Avatar,
  Paper,
} from "@mui/material";
import {
  ArrowBack as BackIcon,
  Home as HomeIcon,
  ChevronRight as ChevronRightIcon,
  Receipt as OrderIcon,
  Person as CustomerIcon,
  LocalShipping as ShippingIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Inventory as InventoryIcon,
  Print as PrintIcon,
  Edit as EditIcon,
  CheckCircle as ValidateIcon,
} from "@mui/icons-material";

import { useSearchParams } from "next/navigation";
import { useEffect, useContext } from "react";
import Link from "next/link";
import { LinksEnum } from "@/utilities/pagesLInksEnum";
import { CurrencyContext } from "@/helpers/currency/CurrencyContext";

import { useOrderDetail } from "@/hooks/useOrderDetail";
import { CircularProgress } from "@mui/material";

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const decodedId = decodeURIComponent(id);

  const { order, loading, updating, updateStatus } = useOrderDetail(decodedId);
  const currencyContext = useContext(CurrencyContext) as { selectedCurr?: { value: number; symbol: string } } | null;
  const currValue = currencyContext?.selectedCurr?.value ?? 1;
  const currSymbol = currencyContext?.selectedCurr?.symbol ?? '$';

  const formatPrice = (priceUSD: number) => {
    const converted = priceUSD * currValue;
    if (currSymbol === "FCFA" || currSymbol === "₦") {
      return `${Math.round(converted).toLocaleString()} ${currSymbol}`;
    }
    return `${currSymbol}${converted.toFixed(2)}`;
  };

  useEffect(() => {
    if (searchParams.get("print") === "true") {
      setTimeout(() => window.print(), 500);
    }
  }, [searchParams]);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "warning";
      case "validated":
        return "info";
      case "reached_warehouse":
      case "shipped_to_stockist":
      case "reached_stockist":
        return "primary";
      case "out_for_delivery":
        return "secondary";
      case "delivered":
      case "completed":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending": return "En attente";
      case "validated": return "Validée";
      case "reached_warehouse": return "Au dépôt";
      case "shipped_to_stockist": return "En transit";
      case "reached_stockist": return "Chez stockiste";
      case "out_for_delivery": return "En livraison";
      case "delivered": return "Livrée";
      case "completed": return "Terminée";
      case "cancelled": return "Annulée";
      default: return status || "Inconnu";
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!order) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="text.secondary" gutterBottom>Commande introuvable</Typography>
        <Button variant="contained" onClick={() => router.push(LinksEnum.orders)} sx={{ mt: 2, borderRadius: 3 }}>
          Retour aux commandes
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: 'auto' }}>
      {/* Breadcrumbs Header */}
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs
          separator={<ChevronRightIcon sx={{ fontSize: "1rem", color: "text.disabled" }} />}
          aria-label="breadcrumb"
          sx={{ mb: 3 }}
        >
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <HomeIcon sx={{ fontSize: "1.1rem", color: "primary.main" }} />
            <Typography variant="body2" fontWeight="500" color="text.secondary">
              Accueil
            </Typography>
          </Stack>
          <Link href={LinksEnum.orders} style={{ textDecoration: "none", color: "inherit" }}>
            <Typography variant="body2" fontWeight="500" sx={{ color: "text.secondary", "&:hover": { color: "primary.main" } }}>
              Commandes
            </Typography>
          </Link>
          <Typography variant="body2" fontWeight="600" color="text.primary">
            Détail
          </Typography>
        </Breadcrumbs>

        {/* Header with actions */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between">
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton
              onClick={() => router.push(LinksEnum.orders)}
              sx={{
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: "14px",
                p: 1.5,
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                "&:hover": { bgcolor: "primary.main", color: "white" },
              }}
            >
              <BackIcon />
            </IconButton>
            <Box>
              <Typography
                variant="h4"
                fontWeight="900"
                sx={{
                  background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: -0.5,
                }}
              >
                #{order.trackingCode}
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight="600">
                Détail de la commande
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1.5} flexWrap="wrap">
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              onClick={() => window.print()}
              sx={{ borderRadius: '12px', px: 2.5 }}
            >
              Imprimer
            </Button>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => router.push(`${LinksEnum.orders}/${id}/edit`)}
              sx={{ borderRadius: '12px', px: 2.5 }}
            >
              Modifier
            </Button>
            {order.status === 'pending' && (
              <Button
                variant="contained"
                color="success"
                disabled={updating}
                startIcon={<ValidateIcon />}
                onClick={() => updateStatus('validated')}
                sx={{ borderRadius: '12px', px: 3 }}
              >
                {updating ? <CircularProgress size={20} /> : 'Valider'}
              </Button>
            )}
          </Stack>
        </Stack>
      </Box>

      {/* Main Grid Layout */}
      <Grid container spacing={3}>
        {/* Left Column - Order Summary & Customer */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Stack spacing={3}>
            {/* Order Summary Card */}
            <Card
              elevation={0}
              sx={{
                borderRadius: "24px",
                border: "1px solid",
                borderColor: "divider",
                overflow: 'hidden',
              }}
            >
              {/* Status Header */}
              <Box
                sx={{
                  p: 3,
                  background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  color: 'white',
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle2" fontWeight="600" sx={{ opacity: 0.8 }}>
                    Statut actuel
                  </Typography>
                  <Chip
                    label={getStatusLabel(order.status)}
                    size="small"
                    sx={{
                      fontWeight: "800",
                      fontSize: "0.7rem",
                      borderRadius: "8px",
                      textTransform: "uppercase",
                      bgcolor: "rgba(255,255,255,0.2)",
                      color: "white",
                      backdropFilter: "blur(10px)",
                    }}
                  />
                </Stack>
              </Box>

              <CardContent sx={{ p: 3 }}>
                <Stack spacing={2.5}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <CalendarIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary" fontWeight="600">
                        Date
                      </Typography>
                    </Stack>
                    <Typography variant="body2" fontWeight="800">
                      {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </Typography>
                  </Stack>

                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <InventoryIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary" fontWeight="600">
                        Articles
                      </Typography>
                    </Stack>
                    <Typography variant="body2" fontWeight="800">
                      {order.items?.length || 0} article(s)
                    </Typography>
                  </Stack>

                  <Divider />

                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle1" fontWeight="800">
                      Total
                    </Typography>
                    <Typography
                      variant="h5"
                      fontWeight="900"
                      sx={{
                        background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {formatPrice(order.total || 0)}
                    </Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>

            {/* Customer Card */}
            <Card
              elevation={0}
              sx={{
                borderRadius: "24px",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                  <Box sx={{ p: 1, bgcolor: "primary.lighter", borderRadius: "12px", display: "flex" }}>
                    <CustomerIcon sx={{ color: "primary.main", fontSize: 20 }} />
                  </Box>
                  <Typography variant="subtitle1" fontWeight="900">
                    Client
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: "16px",
                      fontWeight: "900",
                      fontSize: "1.2rem",
                      bgcolor: "secondary.lighter",
                      color: "secondary.main",
                    }}
                  >
                    {order.customer?.charAt(0)?.toUpperCase() || 'C'}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="900">
                      {order.customer || 'Client'}
                    </Typography>
                    <Chip
                      label="Client"
                      size="small"
                      sx={{ fontSize: '0.65rem', height: 20, borderRadius: '6px' }}
                    />
                  </Box>
                </Stack>

                <Stack spacing={2}>
                  {order.customerPhone && (
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box sx={{ p: 1, bgcolor: "grey.100", borderRadius: "10px" }}>
                        <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      </Box>
                      <Typography variant="body2" fontWeight="600">
                        {order.customerPhone}
                      </Typography>
                    </Stack>
                  )}
                  {order.customerEmail && (
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box sx={{ p: 1, bgcolor: "grey.100", borderRadius: "10px" }}>
                        <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      </Box>
                      <Typography variant="body2" fontWeight="600" sx={{ wordBreak: 'break-all' }}>
                        {order.customerEmail}
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              </CardContent>
            </Card>

            {/* Shipping Card */}
            <Card
              elevation={0}
              sx={{
                borderRadius: "24px",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                  <Box sx={{ p: 1, bgcolor: "info.lighter", borderRadius: "12px", display: "flex" }}>
                    <ShippingIcon sx={{ color: "info.main", fontSize: 20 }} />
                  </Box>
                  <Typography variant="subtitle1" fontWeight="900">
                    Livraison
                  </Typography>
                </Stack>

                <Stack spacing={2}>
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <Box sx={{ p: 1, bgcolor: "grey.100", borderRadius: "10px", mt: 0.5 }}>
                      <LocationIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" fontWeight="800">
                        {order.shippingCity || 'Ville non spécifiée'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {order.shippingCountry || 'Pays non spécifié'}
                      </Typography>
                      {order.shippingStreet && (
                        <Typography variant="caption" color="text.secondary">
                          {order.shippingStreet}
                        </Typography>
                      )}
                    </Box>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        {/* Right Column - Order Items */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card
            elevation={0}
            sx={{
              borderRadius: "24px",
              border: "1px solid",
              borderColor: "divider",
              overflow: "hidden",
              height: '100%',
            }}
          >
            {/* Items Header */}
            <Box
              sx={{
                p: 3,
                bgcolor: (theme) => theme.palette.mode === "light" ? "grey.50" : "grey.900",
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box sx={{ p: 1, bgcolor: "warning.lighter", borderRadius: "12px", display: "flex" }}>
                    <InventoryIcon sx={{ color: "warning.main", fontSize: 20 }} />
                  </Box>
                  <Typography variant="subtitle1" fontWeight="900">
                    Articles commandés
                  </Typography>
                </Stack>
                <Chip
                  label={`${order.items?.length || 0} article(s)`}
                  size="small"
                  color="primary"
                  sx={{ fontWeight: "800", borderRadius: "8px" }}
                />
              </Stack>
            </Box>

            {/* Items List */}
            <Box sx={{ p: 3 }}>
              <Stack spacing={2}>
                {order.items?.map((item: any, idx: number) => (
                  <Paper
                    key={idx}
                    elevation={0}
                    sx={{
                      p: 2.5,
                      borderRadius: "16px",
                      bgcolor: (theme) => theme.palette.mode === "light" ? "grey.50" : "grey.900",
                      border: "1px solid",
                      borderColor: "divider",
                      transition: "all 0.2s",
                      "&:hover": {
                        bgcolor: (theme) => theme.palette.mode === "light" ? "grey.100" : "grey.800",
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                      },
                    }}
                  >
                    <Stack direction="row" spacing={2.5} alignItems="center">
                      <Avatar
                        variant="rounded"
                        sx={{
                          width: 64,
                          height: 64,
                          borderRadius: "14px",
                          bgcolor: "primary.lighter",
                          color: "primary.main",
                          fontWeight: "900",
                          fontSize: "0.9rem",
                        }}
                      >
                        {item.productName?.charAt(0)?.toUpperCase() || 'P'}
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="subtitle2" fontWeight="800" noWrap>
                          {item.productName || 'Produit'}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                          <Chip
                            label={`Qté: ${item.quantity}`}
                            size="small"
                            sx={{
                              fontWeight: "700",
                              borderRadius: "8px",
                              bgcolor: "primary.lighter",
                              color: "primary.main",
                              fontSize: "0.7rem",
                            }}
                          />
                        </Stack>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="subtitle1" fontWeight="900" color="primary.main">
                          {formatPrice(item.price || 0)}
                        </Typography>
                        {item.quantity > 1 && (
                          <Typography variant="caption" color="text.secondary">
                            {formatPrice((item.price || 0) * item.quantity)} total
                          </Typography>
                        )}
                      </Box>
                    </Stack>
                  </Paper>
                ))}
              </Stack>

              {/* Order Total */}
              <Paper
                elevation={0}
                sx={{
                  mt: 3,
                  p: 3,
                  borderRadius: "16px",
                  background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`,
                  border: "1px dashed",
                  borderColor: "primary.main",
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" fontWeight="600">
                      Total de la commande
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Livraison incluse
                    </Typography>
                  </Box>
                  <Typography
                    variant="h4"
                    fontWeight="900"
                    sx={{
                      background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {formatPrice(order.total || 0)}
                  </Typography>
                </Stack>
              </Paper>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
