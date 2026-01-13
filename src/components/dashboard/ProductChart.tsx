"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Box, Typography, Stack, Chip, useTheme } from "@mui/material";

const rawData = [
  { name: "Laptop", quantity: 120, color: "#8f1cd2" },
  { name: "Phone", quantity: 200, color: "#0c24ff" },
  { name: "Tablet", quantity: 150, color: "#707ce5" },
  { name: "Monitor", quantity: 80, color: "#fd5353" },
  { name: "Headphones", quantity: 250, color: "#00b230" },
  { name: "Keyboard", quantity: 100, color: "#fb923c" },
  { name: "Mouse", quantity: 180, color: "#ec4899" },
];

const data = rawData.map((item, index) => ({
  ...item,
  label: String.fromCharCode(65 + index), // A, B, C, ...
}));

export default function ProductChart() {
  const theme = useTheme();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Product Stock Levels
      </Typography>

      {/* Chart Section */}
      <Box sx={{ flexGrow: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 20,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={theme.palette.divider}
            />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: theme.palette.text.secondary,
                fontSize: 12,
                fontWeight: "bold",
              }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: "transparent" }}
              contentStyle={{
                backgroundColor: theme.palette.background.paper,
                borderRadius: "8px",
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: theme.shadows[2],
              }}
              formatter={(value: any, name: any, props: any) => [
                value,
                props.payload.name,
              ]}
            />
            <Bar dataKey="quantity" radius={[4, 4, 0, 0]} barSize={40}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>

      {/* Legend Section */}
      <Box sx={{ mt: 3, pt: 3, borderTop: 1, borderColor: "divider" }}>
        <Stack direction="row" flexWrap="wrap" justifyContent="center" gap={2}>
          {data.map((item) => (
            <Stack
              key={item.name}
              direction="row"
              alignItems="center"
              spacing={1}
            >
              <Chip
                label={item.label}
                size="small"
                sx={{ height: 20, fontSize: "0.7rem", fontWeight: "bold" }}
              />
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight="medium"
              >
                {item.name}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
