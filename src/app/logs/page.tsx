"use client";

import { Box } from "@mui/material";
import LogsHeader from "@/components/logs/LogsHeader";
import LogsTable from "@/components/logs/LogsTable";

export default function LogsPage() {
  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <LogsHeader />
      <LogsTable />
    </Box>
  );
}
