"use client";

import { Box, Stack } from "@mui/material";
import ProductsHeader from "@/components/products/ProductsHeader";
import ProductsTable from "@/components/products/ProductsTable";

export default function ProductsPage() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Stack spacing={4}>
        <ProductsHeader />
        <ProductsTable />
      </Stack>
    </Box>
  );
}
