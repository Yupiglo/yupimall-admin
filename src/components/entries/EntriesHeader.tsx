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
  Login as EntryIcon,
  Inventory as InventoryIcon,
  History as HistoryIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import AddEntryModal from "./AddEntryModal";
import axios from "@/lib/axios";

interface EntriesStats {
  total_entries: number;
  today_entries: number;
  today_quantity: number;
  this_month_entries: number;
  this_month_quantity: number;
  total_value: number;
}

interface EntriesHeaderProps {
  onSearch?: (query: string) => void;
  onEntryAdded?: () => void;
}

export default function EntriesHeader({ onSearch, onEntryAdded }: EntriesHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState<EntriesStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/stock/entries/stats");
      setStats(response.data);
    } catch (err) {
      console.error("Error fetching entry stats:", err);
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

  const handleModalClose = (entryAdded?: boolean) => {
    setIsModalOpen(false);
    if (entryAdded) {
      fetchStats();
      onEntryAdded?.();
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("fr-FR").format(num);
  };

  const entriesStats = [
    {
      id: 1,
      label: "Today's Entries",
      value: loading ? "-" : stats?.today_entries.toString() || "0",
      subValue: loading ? "" : `${formatNumber(stats?.today_quantity || 0)} items`,
      icon: <EntryIcon />,
      color: "primary",
    },
    {
      id: 2,
      label: "This Month",
      value: loading ? "-" : stats?.this_month_entries.toString() || "0",
      subValue: loading ? "" : `${formatNumber(stats?.this_month_quantity || 0)} items`,
      icon: <InventoryIcon />,
      color: "success",
    },
    {
      id: 3,
      label: "Total Entries",
      value: loading ? "-" : formatNumber(stats?.total_entries || 0),
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
            Stock Entries
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track and manage incoming inventory.
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
          Add Entry
        </Button>
      </Stack>

      {/* Entry Summary Section */}
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
          <HistoryIcon color="primary" fontSize="small" /> Entry Summary
        </Typography>
        <Grid container spacing={3}>
          {entriesStats.map((stat) => (
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
                          <TrendingUpIcon
                            color="success"
                            sx={{ fontSize: 14 }}
                          />
                          <Typography
                            variant="caption"
                            fontWeight="bold"
                            color="success.main"
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
        placeholder="Search entries, products, or suppliers..."
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

      <AddEntryModal open={isModalOpen} onClose={handleModalClose} />
    </Box>
  );
}
