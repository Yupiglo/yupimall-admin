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
  Input as EntryIcon,
} from "@mui/icons-material";

export default function EntryEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const decodedId = decodeURIComponent(id);

  const [formData, setFormData] = useState({
    status: "Completed",
    quantity: "25",
    notes: "Restock for winter season.",
  });

  const handleSave = () => {
    console.log("Saving entry:", formData);
    router.push(`/entries/${encodeURIComponent(decodedId)}`);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <IconButton
          onClick={() =>
            router.push(`/entries/${encodeURIComponent(decodedId)}`)
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
            Edit Entry
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Correct stock levels or update reception notes.
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
                <EntryIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Core Data
                </Typography>
              </Stack>
              <Stack spacing={3}>
                <TextField
                  select
                  fullWidth
                  label="Entry Status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                >
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </TextField>
                <TextField
                  fullWidth
                  label="Quantity Received"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                />
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
                Reception Notes
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Internal comments regarding this stock entry.
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={6}
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Enter notes..."
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
