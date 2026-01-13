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
  CircularProgress,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  Logout as ExitIcon,
  LocalShipping as ShippingIcon,
  History as HistoryIcon,
  TrendingDown as TrendingDownIcon,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import AddExitModal from "./AddExitModal";
import axios from "@/lib/axios";

interface ExitsStats {
  total_exits: number;
  today_exits: number;
  today_quantity: number;
  this_month_exits: number;
  this_month_quantity: number;
  by_reason: Record<string, number>;
}

interface ExitsHeaderProps {
  onSearch?: (query: string) => void;
  onExitAdded?: () => void;
}

export default function ExitsHeader({ onSearch, onExitAdded }: ExitsHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState<ExitsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/stock/exits/stats");
      setStats(response.data);
    } catch (err) {
      console.error("Error fetching exit stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch?.(value);
  };

  const handleModalClose = (exitAdded?: boolean) => {
    setIsModalOpen(false);
    if (exitAdded) {
      fetchStats();
      onExitAdded?.();
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("fr-FR").format(num);
  };

  const exitsStats = [
    {
      id: 1,
      label: "Today's Exits",
      value: loading ? "-" : stats?.today_exits.toString() || "0",
      subValue: loading ? "" : `${formatNumber(stats?.today_quantity || 0)} items`,
      icon: <ExitIcon />,
      color: "primary",
    },
    {
      id: 2,
      label: "This Month",
      value: loading ? "-" : stats?.this_month_exits.toString() || "0",
      subValue: loading ? "" : `${formatNumber(stats?.this_month_quantity || 0)} items`,
      icon: <ShippingIcon />,
      color: "success",
    },
    {
      id: 3,
      label: "Total Exits",
      value: loading ? "-" : formatNumber(stats?.total_exits || 0),
      subValue: "All time",
      icon: <HistoryIcon />,
      color: "warning",
    },
  ];

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
            Stock Exits
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and track outgoing inventory.
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
          Add Exit
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
          <HistoryIcon color="primary" fontSize="small" /> Exit Summary
        </Typography>
        <Grid container spacing={3}>
          {exitsStats.map((stat) => (
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
                      {loading ? <CircularProgress size={24} /> : stat.icon}
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
                          <TrendingDownIcon
                            color="error"
                            sx={{ fontSize: 14 }}
                          />
                          <Typography
                            variant="caption"
                            fontWeight="bold"
                            color="error.main"
                          >
                            {stat.subValue}
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
        placeholder="Search exits, products, or reasons..."
        variant="outlined"
        fullWidth
        value={searchValue}
        onChange={handleSearch}
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

      <AddExitModal open={isModalOpen} onClose={handleModalClose} />
    </Box>
  );
}
