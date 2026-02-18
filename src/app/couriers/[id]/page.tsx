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
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  ArrowBack as BackIcon,
  Edit as EditIcon,
  LocalShipping as VehicleIcon,
  Phone as PhoneIcon,
  NoCrash as PlateIcon,
  Stars as RatingIcon,
  Speed as PerformanceIcon,
} from "@mui/icons-material";
import axiosInstance from "@/lib/axios";

export default function CourierDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const [courier, setCourier] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourier = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`users/${id}`);
        const data = response.data?.user || response.data?.data || response.data;
        setCourier(data);
      } catch (err: any) {
        try {
          const response = await axiosInstance.get("delivery/personnel");
          const personnel = response.data?.personnel || response.data?.data || response.data || [];
          const found = (Array.isArray(personnel) ? personnel : []).find((p: any) => String(p.id) === String(id));
          if (found) setCourier(found);
          else setError("Livreur introuvable");
        } catch {
          setError("Impossible de charger les données du livreur");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCourier();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !courier) {
    return (
      <Box sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {error || "Livreur introuvable"}
        </Alert>
        <Button startIcon={<BackIcon />} onClick={() => router.push("/couriers")}>
          Retour aux livreurs
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <IconButton
          onClick={() => router.push("/couriers")}
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
            Profil du Livreur
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Détails et performance du livreur.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => router.push(`/couriers/${id}/edit`)}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: "bold",
            px: 3,
            boxShadow: "none",
          }}
        >
          Modifier
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
                  src={courier.avatar || courier.image || undefined}
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
                  }}
                >
                  {courier.name?.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="h5" fontWeight="bold">
                  {courier.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  #{courier.id}
                </Typography>
                <Chip
                  label={courier.status || "Actif"}
                  color="success"
                  size="small"
                  sx={{ mt: 2, fontWeight: "bold", borderRadius: "6px" }}
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
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                  Informations
                </Typography>
                <Stack spacing={2.5}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <VehicleIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Véhicule
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {courier.vehicle || "—"}
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <PlateIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Plaque
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: "monospace", fontWeight: "bold" }}>
                        {courier.plate || courier.license_plate || "—"}
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <PhoneIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Téléphone
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {courier.phone || "—"}
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Grid container spacing={3}>
            {[
              {
                label: "Note",
                value: courier.rating ? `${courier.rating}/5.0` : "—",
                icon: <RatingIcon />,
                color: "warning.main",
              },
              {
                label: "Total livraisons",
                value: String(courier.totalDeliveries || courier.total_deliveries || "—"),
                icon: <VehicleIcon />,
                color: "primary.main",
              },
              {
                label: "Performance",
                value: courier.performance || "—",
                icon: <PerformanceIcon />,
                color: "success.main",
              },
            ].map((stat, idx) => (
              <Grid key={idx} size={{ xs: 12, sm: 4 }}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: "16px",
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box sx={{ color: stat.color, display: "flex" }}>
                        {stat.icon}
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          {stat.label}
                        </Typography>
                        <Typography variant="h6" fontWeight="bold">
                          {stat.value}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}

            <Grid size={{ xs: 12 }}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: "20px",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Livraisons actives
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  <Box
                    sx={{
                      p: 3,
                      textAlign: "center",
                      bgcolor: "rgba(0,0,0,0.02)",
                      borderRadius: "12px",
                      border: "1px dashed",
                      borderColor: "divider",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Aucune livraison active pour ce livreur.
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
