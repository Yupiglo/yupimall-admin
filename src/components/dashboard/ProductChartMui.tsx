"use client";

import {
  Box,
  Typography,
  Stack,
  useTheme,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

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

export default function ProductChartMui() {
  const theme = useTheme();

  return (
    <Card variant="outlined" sx={{ height: "100%", borderRadius: "16px" }}>
      <CardContent
        sx={{ height: "100%", display: "flex", flexDirection: "column" }}
      >
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Product Stock Levels
        </Typography>

        {/* Chart Section */}
        <Box sx={{ flexGrow: 1, width: "100%", minHeight: 400 }}>
          <BarChart
            dataset={data}
            xAxis={[
              {
                scaleType: "band",
                dataKey: "label",
                tickLabelStyle: {
                  fill: theme.palette.text.secondary,
                  fontSize: 12,
                  fontWeight: "bold",
                },
              },
            ]}
            yAxis={[
              {
                tickLabelStyle: {
                  fill: theme.palette.text.secondary,
                  fontSize: 12,
                },
              },
            ]}
            series={[
              {
                dataKey: "quantity",
                // Removing explicit label to hide the default "Quantity" legend entry
                valueFormatter: (value) => `${value} units`,
              },
            ]}
            height={400}
            slotProps={{
              legend: {
                hidden: true, // If types allow, otherwise removing label above works
              } as any, // Type cast to avoid the reported strict property error
            }}
            colors={data.map((d) => d.color)}
            margin={{ top: 20, bottom: 40, left: 40, right: 10 }}
            sx={{
              "& .MuiBarElement-root": {
                rx: 4,
              },
            }}
          />
        </Box>

        {/* Legend Section matching previous design */}
        <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: "divider" }}>
          <Stack
            direction="row"
            flexWrap="wrap"
            justifyContent="center"
            gap={2}
          >
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
      </CardContent>
    </Card>
  );
}
