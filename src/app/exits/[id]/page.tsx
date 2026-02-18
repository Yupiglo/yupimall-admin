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
  Chip,
  Divider,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  ArrowBack as BackIcon,
  Print as PrintIcon,
  Output as ExitIcon,
  Inventory as ProductIcon,
  Person as DestinationIcon,
  CalendarToday as DateIcon,
  Layers as QtyIcon,
} from "@mui/icons-material";

import { useSearchParams } from "next/navigation";
import axiosInstance from "@/lib/axios";

export default function ExitDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const decodedId = decodeURIComponent(id);

  const [exit, setExit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get("print") === "true") {
      window.print();
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchExit = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get(`stock/exits/${decodedId}`);
        const exitData = response.data.data || response.data;
        if (exitData) {
          setExit({
            id: exitData.reference || `#EXT-${exitData.id}`,
            product: exitData.product?.title || exitData.product_name || 'Unknown Product',
            sku: exitData.product?.sku || exitData.sku || 'N/A',
            quantity: exitData.quantity || 0,
            destination: exitData.user?.name || exitData.destination || 'Not specified',
            date: exitData.created_at 
              ? new Date(exitData.created_at).toLocaleString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })
              : 'Date not available',
            status: exitData.reason === 'sale' ? 'Delivered' : exitData.reason || 'Completed',
            notes: exitData.notes || exitData.reason || 'No notes available.',
          });
        }
      } catch (err) {
        console.error("Error fetching exit:", err);
        setError("Failed to load exit details");
      } finally {
        setLoading(false);
      }
    };

    if (decodedId) {
      fetchExit();
    }
  }, [decodedId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !exit) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || "Exit not found"}
        </Alert>
        <Button variant="contained" onClick={() => router.push("/exits")}>
          Back to Exits
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <IconButton
          onClick={() => router.push("/exits")}
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
            Stock Exit
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tracking outbound inventory and shipment details.
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
          Print Memo
        </Button>
      </Stack>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 5 }}>
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
                  <ExitIcon color="error" />
                  <Typography variant="h6" fontWeight="bold">
                    Exit Information
                  </Typography>
                </Stack>
                <Stack spacing={2.5}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Exit ID
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {exit.id}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Status
                    </Typography>
                    <Chip
                      label={exit.status}
                      size="small"
                      color="success"
                      sx={{ fontWeight: "bold", borderRadius: "6px" }}
                    />
                  </Stack>
                  <Divider />
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <DestinationIcon color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Destination
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {exit.destination}
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
              <CardContent sx={{ p: 4 }}>
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <ProductIcon color="primary" sx={{ fontSize: 20 }} />
                  <Typography variant="subtitle2" fontWeight="bold">
                    Product Removed
                  </Typography>
                </Stack>
                <Typography variant="body1" fontWeight="bold">
                  {exit.product}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  SKU: {exit.sku}
                </Typography>
                <Stack
                  direction="row"
                  sx={{
                    mt: 2,
                    p: 2,
                    bgcolor: "error.main",
                    color: "white",
                    borderRadius: "12px",
                  }}
                  spacing={2}
                  alignItems="center"
                >
                  <QtyIcon />
                  <Box>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Quantity Removed
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {exit.quantity} Units
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
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
                Logistics Memo
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Stack spacing={4}>
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Departure Date
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <DateIcon fontSize="small" color="action" />
                    <Typography variant="body1" fontWeight="medium">
                      {exit.date}
                    </Typography>
                  </Stack>
                </Box>

                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Internal Memo
                  </Typography>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "background.default",
                      borderRadius: "12px",
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Typography variant="body2">{exit.notes}</Typography>
                  </Box>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
