"use client";

import { Box, Stack } from "@mui/material";
import CouriersHeader from "@/components/couriers/CouriersHeader";
import CouriersTable from "@/components/couriers/CouriersTable";

export default function CouriersPage() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Stack spacing={4}>
        <CouriersHeader />
        <CouriersTable />
      </Stack>
    </Box>
  );
}
