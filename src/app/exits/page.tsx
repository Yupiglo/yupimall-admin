"use client";

import { Box, Stack } from "@mui/material";
import ExitsHeader from "@/components/exits/ExitsHeader";
import ExitsTable from "@/components/exits/ExitsTable";
import { useState } from "react";

export default function ExitsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleExitAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Stack spacing={4}>
        <ExitsHeader onSearch={handleSearch} onExitAdded={handleExitAdded} />
        <ExitsTable searchQuery={searchQuery} refreshTrigger={refreshTrigger} />
      </Stack>
    </Box>
  );
}
