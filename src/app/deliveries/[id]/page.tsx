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
} from "@mui/material";
import {
  ArrowBack as BackIcon,
  Print as PrintIcon,
  LocalShipping as DeliveryIcon,
  Receipt as OrderIcon,
  Person as CourierIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const deliveries = [
  {
    id: "#DEL-4412",
    orderId: "#ORD-9921",
    courier: "John Doe",
    status: "In Progress",
    timeWindow: "2:00 PM - 4:00 PM",
    address: "123 Main St, New York, NY",
  },
];

export default function DeliveryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const decodedId = decodeURIComponent(id);

  useEffect(() => {
    if (searchParams.get("print") === "true") {
      window.print();
    }
  }, [searchParams]);

  // Mock finding delivery by ID
  const delivery = deliveries.find((d) => d.id === decodedId) || deliveries[0];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <IconButton
          onClick={() => router.push("/deliveries")}
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
            Delivery Status
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tracking logistics and courier assignment.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<PrintIcon />}
          onClick={() => window.print()}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: "bold",
            px: 3,
            boxShadow: "none",
          }}
        >
          Print Label
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
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  sx={{ mb: 3 }}
                >
                  <DeliveryIcon color="primary" />
                  <Typography variant="h6" fontWeight="bold">
                    Delivery Details
                  </Typography>
                </Stack>
                <Stack spacing={2.5}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Delivery ID
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {delivery.id}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Status
                    </Typography>
                    <Chip
                      label={delivery.status}
                      size="small"
                      color="primary"
                      sx={{ fontWeight: "bold", borderRadius: "6px" }}
                    />
                  </Stack>
                  <Divider />
                  <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <LocationIcon
                      color="action"
                      sx={{ fontSize: 20, mt: 0.3 }}
                    />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Destination
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {delivery.address}
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
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
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <OrderIcon color="primary" sx={{ fontSize: 20 }} />
                  <Typography variant="subtitle2" fontWeight="bold">
                    Linked Order
                  </Typography>
                </Stack>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  color="primary.main"
                >
                  {delivery.orderId}
                </Typography>
                <Button
                  fullWidth
                  size="small"
                  variant="outlined"
                  sx={{ mt: 1.5, borderRadius: "8px", textTransform: "none" }}
                  onClick={() =>
                    router.push(
                      `/orders/${encodeURIComponent(delivery.orderId)}`
                    )
                  }
                >
                  View Order Details
                </Button>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
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
                Logistics Execution
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                      p: 2,
                      bgcolor: "background.default",
                      borderRadius: "12px",
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <CourierIcon color="primary" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Assigned Courier
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {delivery.courier}
                      </Typography>
                      <Button
                        size="small"
                        sx={{ p: 0, mt: 0.5, textTransform: "none" }}
                        onClick={() => router.push("/couriers")}
                      >
                        View Courier
                      </Button>
                    </Box>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                      p: 2,
                      bgcolor: "background.default",
                      borderRadius: "12px",
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <TimeIcon color="primary" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Time Window
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {delivery.timeWindow}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>

              <Typography variant="h6" fontWeight="bold" sx={{ mt: 4, mb: 2 }}>
                Delivery Timeline
              </Typography>
              <Box
                sx={{
                  p: 4,
                  textAlign: "center",
                  bgcolor: "rgba(0,0,0,0.02)",
                  borderRadius: "16px",
                  border: "1px dashed",
                  borderColor: "divider",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Real-time delivery milestones and GPS tracking logs will be
                  integrated here.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
