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
  Input as EntryIcon,
  Inventory as ProductIcon,
  Business as SupplierIcon,
  CalendarToday as DateIcon,
  Layers as QtyIcon,
} from "@mui/icons-material";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const entries = [
  {
    id: "#ENT-001",
    product: "Classic Leather Jacket",
    sku: "JKT-001",
    quantity: 25,
    supplier: "Global Leathers Inc.",
    date: "Oct 26, 2025, 10:30 AM",
    status: "Completed",
    notes: "Restock for winter season.",
  },
];

export default function EntryDetailPage({
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

  const entry = entries.find((e) => e.id === decodedId) || entries[0];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <IconButton
          onClick={() => router.push("/entries")}
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
            Inventory Entry
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Detailing stock reception and supplier information.
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
          Print Report
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
                  <EntryIcon color="primary" />
                  <Typography variant="h6" fontWeight="bold">
                    Reception Info
                  </Typography>
                </Stack>
                <Stack spacing={2.5}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Entry ID
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {entry.id}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Status
                    </Typography>
                    <Chip
                      label={entry.status}
                      size="small"
                      color="success"
                      sx={{ fontWeight: "bold", borderRadius: "6px" }}
                    />
                  </Stack>
                  <Divider />
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <SupplierIcon color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Supplier
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {entry.supplier}
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
                    Product Received
                  </Typography>
                </Stack>
                <Typography variant="body1" fontWeight="bold">
                  {entry.product}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  SKU: {entry.sku}
                </Typography>
                <Stack
                  direction="row"
                  sx={{
                    mt: 2,
                    p: 2,
                    bgcolor: "primary.main",
                    color: "white",
                    borderRadius: "12px",
                  }}
                  spacing={2}
                  alignItems="center"
                >
                  <QtyIcon />
                  <Box>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Quantity Added
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {entry.quantity} Units
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
                Additional Information
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Stack spacing={4}>
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Reception Date
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <DateIcon fontSize="small" color="action" />
                    <Typography variant="body1" fontWeight="medium">
                      {entry.date}
                    </Typography>
                  </Stack>
                </Box>

                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Internal Notes
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
                    <Typography variant="body2">{entry.notes}</Typography>
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
