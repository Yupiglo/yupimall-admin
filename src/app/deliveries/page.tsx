"use client";

import { Box, Stack } from "@mui/material";
import DeliveriesHeader from "@/components/deliveries/DeliveriesHeader";
import DeliveriesTable from "@/components/deliveries/DeliveriesTable";

export default function DeliveriesPage() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Stack spacing={4}>
        <DeliveriesHeader />
        <DeliveriesTable />
      </Stack>
    </Box>
  );
}
