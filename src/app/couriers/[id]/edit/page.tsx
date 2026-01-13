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
  Person as PersonIcon,
  LocalShipping as VehicleIcon,
} from "@mui/icons-material";

export default function CourierEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const decodedId = decodeURIComponent(id);

  const [formData, setFormData] = useState({
    name: "John Doe",
    vehicle: "Motorcycle",
    phone: "+1 555-0201",
    plate: "ABC-1234",
    status: "Active",
  });

  const handleSave = () => {
    console.log("Saving courier:", formData);
    router.push(`/couriers/${encodeURIComponent(decodedId)}`);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <IconButton
          onClick={() =>
            router.push(`/couriers/${encodeURIComponent(decodedId)}`)
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
            Edit Courier
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Update courier profile and vehicle details.
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
                <PersonIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Personal Details
                </Typography>
              </Stack>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                />
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                />
                <TextField
                  select
                  fullWidth
                  label="Status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="On Leave">On Leave</MenuItem>
                  <MenuItem value="Terminated">Terminated</MenuItem>
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
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                sx={{ mb: 3 }}
              >
                <VehicleIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Vehicle Information
                </Typography>
              </Stack>
              <Stack spacing={3}>
                <TextField
                  select
                  fullWidth
                  label="Vehicle Type"
                  value={formData.vehicle}
                  onChange={(e) =>
                    setFormData({ ...formData, vehicle: e.target.value })
                  }
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                >
                  <MenuItem value="Motorcycle">Motorcycle</MenuItem>
                  <MenuItem value="Van">Van</MenuItem>
                  <MenuItem value="Car">Car</MenuItem>
                  <MenuItem value="Bicycle">Bicycle</MenuItem>
                </TextField>
                <TextField
                  fullWidth
                  label="License Plate"
                  value={formData.plate}
                  onChange={(e) =>
                    setFormData({ ...formData, plate: e.target.value })
                  }
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                  placeholder="ABC-1234"
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
