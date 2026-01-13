"use client";

import { Box, Stack } from "@mui/material";
import CustomersHeader from "@/components/customers/CustomersHeader";
import CustomersTable from "@/components/customers/CustomersTable";

export default function CustomersPage() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Stack spacing={4}>
        <CustomersHeader />
        <CustomersTable />
      </Stack>
    </Box>
  );
}
