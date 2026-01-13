"use client";

import { Box, Stack } from "@mui/material";
import EntriesHeader from "@/components/entries/EntriesHeader";
import EntriesTable from "@/components/entries/EntriesTable";
import { useState } from "react";

export default function EntriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleEntryAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Stack spacing={4}>
        <EntriesHeader onSearch={handleSearch} onEntryAdded={handleEntryAdded} />
        <EntriesTable searchQuery={searchQuery} refreshTrigger={refreshTrigger} />
      </Stack>
    </Box>
  );
}
