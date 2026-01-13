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
  Person as PersonIcon,
  DirectionsBike as BikeIcon,
  Timer as TimerIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import { useState } from "react";
import AddCourierModal from "./AddCourierModal";

const courierStats = [
  {
    id: 1,
    label: "Active Couriers",
    value: "24",
    growth: "+2",
    icon: <PersonIcon />,
    color: "primary",
  },
  {
    id: 2,
    label: "On Delivery",
    value: "18",
    growth: "High",
    icon: <BikeIcon />,
    color: "info",
  },
  {
    id: 3,
    label: "Avg. Delivery Time",
    value: "24m",
    growth: "-2m",
    icon: <TimerIcon />,
    color: "success",
  },
];

export default function CouriersHeader() {
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
            Couriers
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your delivery team and monitor performance.
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
          Add Courier
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
          <PersonIcon color="primary" fontSize="small" /> Courier Summary
        </Typography>
        <Grid container spacing={3}>
          {courierStats.map((stat) => (
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
        placeholder="Search by name, email, or phone..."
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

      <AddCourierModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Box>
  );
}
