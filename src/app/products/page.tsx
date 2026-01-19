"use client";

import { useState } from "react";
import { Box, Stack } from "@mui/material";
import ProductsHeader from "@/components/products/ProductsHeader";
import ProductsTable from "@/components/products/ProductsTable";

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Stack spacing={4}>
        <ProductsHeader
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedSubcategory={selectedSubcategory}
          setSelectedSubcategory={setSelectedSubcategory}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
        />
        <ProductsTable
          selectedCategory={selectedCategory}
          selectedSubcategory={selectedSubcategory}
          selectedStatus={selectedStatus}
        />
      </Stack>
    </Box>
  );
}
