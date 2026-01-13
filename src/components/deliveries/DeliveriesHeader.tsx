"use client";

import {
  Box,
  TextField,
  Button,
  Stack,
  InputAdornment,
  Typography,
  Card,
  CardContent,
  Avatar,
  Grid,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  LocalShipping as ShippingIcon,
  Pending as PendingIcon,
  CheckCircle as DeliveredIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import { useState } from "react";
import AddDeliveryModal from "./AddDeliveryModal";

const deliveryStats = [
  {
    id: 1,
    label: "Pending Deliveries",
    value: "14",
    growth: "+2.5%",
    icon: <PendingIcon />,
    color: "warning",
  },
  {
    id: 2,
    label: "In Transit",
    value: "8",
    growth: "+15.2%",
    icon: <ShippingIcon />,
    color: "info",
  },
  {
    id: 3,
    label: "Completed (Today)",
    value: "156",
    growth: "+24.8%",
    icon: <DeliveredIcon />,
    color: "success",
  },
];

export default function DeliveriesHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Box sx={{ mb: 4 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight="bold"
            color="primary.main"
            gutterBottom
          >
            Deliveries
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and track your delivery logistics.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsModalOpen(true)}
          sx={{
            py: 1.5,
            px: 3,
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: "bold",
            boxShadow: "none",
          }}
        >
          Assign Delivery
        </Button>
      </Stack>

      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{
            mb: 2,
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "text.tertio",
          }}
        >
          <ShippingIcon color="primary" fontSize="small" /> Delivery Summary
        </Typography>
        <Grid container spacing={3}>
          {deliveryStats.map((stat) => (
            <Grid key={stat.id} size={{ xs: 12, md: 4 }}>
              <Card
                variant="outlined"
                sx={{
                  borderRadius: "16px",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "12px",
                        bgcolor: (theme) =>
                          theme.palette.mode === "dark"
                            ? `${stat.color}.dark`
                            : `${stat.color}.light`,
                        color: `${stat.color}.tertio`,
                      }}
                    >
                      {stat.icon}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight="bold"
                      >
                        {stat.label}
                      </Typography>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="baseline"
                      >
                        <Typography variant="h6" fontWeight="bold">
                          {stat.value}
                        </Typography>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={0.5}
                        >
                          <TrendingUpIcon
                            color="success"
                            sx={{ fontSize: 14 }}
                          />
                          <Typography
                            variant="caption"
                            fontWeight="bold"
                            color="success.main"
                          >
                            {stat.growth}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <TextField
        placeholder="Search Order ID, Customer, or Courier..."
        variant="outlined"
        fullWidth
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            bgcolor: "background.paper",
          },
        }}
      />

      <AddDeliveryModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Box>
  );
}
