"use client";

import { use, useState } from "react";
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
} from "@mui/material";
import {
  ArrowBack as BackIcon,
  Save as SaveIcon,
  LocalShipping as DeliveryIcon,
} from "@mui/icons-material";

export default function DeliveryEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const decodedId = decodeURIComponent(id);

  const [formData, setFormData] = useState({
    status: "In Progress",
    courier: "John Doe",
    notes: "Handle with care. Fragile items.",
  });

  const handleSave = () => {
    console.log("Saving delivery:", formData);
    router.push(`/deliveries/${encodeURIComponent(decodedId)}`);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <IconButton
          onClick={() =>
            router.push(`/deliveries/${encodeURIComponent(decodedId)}`)
          }
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
            Modify Delivery
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Assign courier and update live delivery status.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: "bold",
            px: 4,
            boxShadow: "none",
          }}
        >
          Save Changes
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
              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                sx={{ mb: 3 }}
              >
                <DeliveryIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Assignment & Status
                </Typography>
              </Stack>
              <Stack spacing={3}>
                <TextField
                  select
                  fullWidth
                  label="Delivery Status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Picked Up">Picked Up</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Delivered">Delivered</MenuItem>
                  <MenuItem value="Delayed">Delayed</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </TextField>
                <TextField
                  select
                  fullWidth
                  label="Assign Courier"
                  value={formData.courier}
                  onChange={(e) =>
                    setFormData({ ...formData, courier: e.target.value })
                  }
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                >
                  <MenuItem value="John Doe">John Doe</MenuItem>
                  <MenuItem value="Jane Smith">Jane Smith</MenuItem>
                  <MenuItem value="Mike Tyson">Mike Tyson</MenuItem>
                  <MenuItem value="Sarah Connor">Sarah Connor</MenuItem>
                </TextField>
              </Stack>
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
                Delivery Instructions
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Specific notes for the courier regarding this delivery.
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={6}
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Enter special instructions..."
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
