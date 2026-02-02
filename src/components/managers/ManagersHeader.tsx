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
  AdminPanelSettings as AdminIcon,
  Group as StaffIcon,
  Security as RoleIcon,
  People as PeopleIcon,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import AddManagerModal from "./AddManagerModal";

interface ManagersHeaderProps {
  onSearchChange?: (query: string) => void;
  onUserCreated?: () => void;
  stats?: { total: number; byRole: Record<string, number> };
}

export default function ManagersHeader({
  onSearchChange,
  onUserCreated,
  stats
}: ManagersHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange?.(searchValue);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchValue, onSearchChange]);

  const handleUserCreated = () => {
    setIsModalOpen(false);
    onUserCreated?.();
  };

  const managerStats = [
    {
      id: 1,
      label: "Total Users",
      value: stats?.total?.toString() || "0",
      icon: <PeopleIcon />,
      color: "primary",
    },
    {
      id: 2,
      label: "Admins",
      value: ((stats?.byRole?.admin || 0) + (stats?.byRole?.dev || 0)).toString(),
      icon: <AdminIcon />,
      color: "error",
    },
    {
      id: 3,
      label: "Staff",
      value: ((stats?.byRole?.warehouse || 0) + (stats?.byRole?.webmaster || 0) + (stats?.byRole?.stockist || 0)).toString(),
      icon: <StaffIcon />,
      color: "info",
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
            User Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage all users and their permissions.
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
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
            Create User
          </Button>
        </Stack>
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
            color: "text.secondary",
          }}
        >
          <RoleIcon color="primary" fontSize="small" /> Overview
        </Typography>
        <Grid container spacing={3}>
          {managerStats.map((stat) => (
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
                        bgcolor: `${stat.color}.main`,
                        color: "white",
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
                      <Typography variant="h5" fontWeight="bold">
                        {stat.value}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <TextField
        placeholder="Search by name, email, or username..."
        variant="outlined"
        fullWidth
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
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

      <AddManagerModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleUserCreated}
      />
    </Box>
  );
}
