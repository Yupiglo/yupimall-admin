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
  Avatar,
  Chip,
  Divider,
  Grid,
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

const couriers = [
  {
    id: "#COU-101",
    name: "John Doe",
    vehicle: "Motorcycle",
    phone: "+1 555-0201",
    plate: "ABC-1234",
    status: "Active",
    rating: 4.8,
  },
];

export default function CourierDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const decodedId = decodeURIComponent(id);

  // Mock finding courier by ID
  const courier = couriers.find((c) => c.id === decodedId) || couriers[0];

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
            Courier Profile
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Viewing courier details and performance metrics.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() =>
            router.push(`/couriers/${encodeURIComponent(decodedId)}/edit`)
          }
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: "bold",
            px: 3,
            boxShadow: "none",
          }}
        >
          Edit Courier
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
                  }}
                >
                  {courier.name.charAt(0)}
                </Avatar>
                <Typography variant="h5" fontWeight="bold">
                  {courier.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {courier.id}
                </Typography>
                <Chip
                  label={courier.status}
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
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{ mb: 2 }}
                >
                  Logistics Info
                </Typography>
                <Stack spacing={2.5}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <VehicleIcon
                      sx={{ color: "text.secondary", fontSize: 20 }}
                    />
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        Vehicle Type
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {courier.vehicle}
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <PlateIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        License Plate
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontFamily: "monospace", fontWeight: "bold" }}
                      >
                        {courier.plate}
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
                        Phone
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {courier.phone}
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
                label: "Courier Rating",
                value: `${courier.rating}/5.0`,
                icon: <RatingIcon />,
                color: "warning.main",
              },
              {
                label: "Deliveries Today",
                value: "8",
                icon: <VehicleIcon />,
                color: "primary.main",
              },
              {
                label: "Performance",
                value: "98%",
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
                    Active Deliveries
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
                      No active deliveries currently assigned to this courier.
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
