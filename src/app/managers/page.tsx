"use client";

import { Box, Stack } from "@mui/material";
import ManagersHeader from "@/components/managers/ManagersHeader";
import ManagersTable from "@/components/managers/ManagersTable";
import { useState, useCallback } from "react";

export default function ManagersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [stats, setStats] = useState<{ total: number; byRole: Record<string, number> }>({ total: 0, byRole: {} });

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleUserCreated = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  const handleStatsUpdate = useCallback((newStats: { total: number; byRole: Record<string, number> }) => {
    setStats(newStats);
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Stack spacing={4}>
        <ManagersHeader
          onSearchChange={handleSearchChange}
          onUserCreated={handleUserCreated}
          stats={stats}
        />
        <ManagersTable
          key={refreshKey}
          searchQuery={searchQuery}
          onStatsUpdate={handleStatsUpdate}
        />
      </Stack>
    </Box>
  );
}
