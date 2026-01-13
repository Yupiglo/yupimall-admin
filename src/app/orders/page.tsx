"use client";

import { Box, Stack } from "@mui/material";
import OrdersHeader from "@/components/orders/OrdersHeader";
import OrdersTable from "@/components/orders/OrdersTable";

export default function OrdersPage() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Stack spacing={4}>
        <OrdersHeader />
        <OrdersTable />
      </Stack>
    </Box>
  );
}
