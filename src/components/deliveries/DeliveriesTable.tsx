"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Typography,
  Box,
  Stack,
  Tooltip,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  Print as PrintIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";

const deliveries = [
  {
    id: "#DEL-101",
    orderId: "#ORD-9921",
    customer: "Alice Johnson",
    courier: "John Doe",
    address: "123 Main St, New York",
    date: "Jun 12, 2026, 02:00 PM",
    status: "Delivered",
  },
  {
    id: "#DEL-102",
    orderId: "#ORD-9920",
    customer: "Mark Spencer",
    courier: "Jane Smith",
    address: "456 Side Ave, Brooklyn",
    date: "Jun 12, 2026, 03:45 PM",
    status: "In Transit",
  },
  {
    id: "#DEL-103",
    orderId: "#ORD-9919",
    customer: "Elena Gomez",
    courier: "Mike Tyson",
    address: "789 High Rd, Queens",
    date: "Jun 11, 2026, 11:00 AM",
    status: "Pending",
  },
  {
    id: "#DEL-104",
    orderId: "#ORD-9918",
    customer: "David Lee",
    courier: "John Doe",
    address: "321 Park Ln, Manhattan",
    date: "Jun 10, 2026, 09:30 AM",
    status: "Cancelled",
  },
];

export default function DeliveriesTable() {
  const router = useRouter();
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "success";
      case "In Transit":
        return "info";
      case "Pending":
        return "warning";
      case "Cancelled":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{ borderRadius: "16px", border: "1px solid", borderColor: "divider" }}
    >
      <Table sx={{ minWidth: 650 }}>
        <TableHead sx={{ bgcolor: "background.default" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Delivery ID</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Order & Customer</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Courier</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Address</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {deliveries.map((delivery) => (
            <TableRow
              key={delivery.id}
              hover
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell sx={{ fontWeight: "medium" }}>{delivery.id}</TableCell>
              <TableCell>
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {delivery.orderId}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {delivery.customer}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: "medium" }}>
                {delivery.courier}
              </TableCell>
              <TableCell
                sx={{
                  color: "text.secondary",
                  maxWidth: 200,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {delivery.address}
              </TableCell>
              <TableCell sx={{ color: "text.secondary" }}>
                {delivery.date}
              </TableCell>
              <TableCell>
                <Chip
                  label={delivery.status}
                  color={getStatusColor(delivery.status) as any}
                  size="small"
                  variant="outlined"
                  sx={{
                    fontWeight: 500,
                    borderRadius: "100px",
                    px: 0.5,
                  }}
                />
              </TableCell>
              <TableCell align="right">
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <Tooltip title="View Details">
                    <IconButton
                      size="small"
                      onClick={() =>
                        router.push(
                          `/deliveries/${encodeURIComponent(delivery.id)}`
                        )
                      }
                    >
                      <ViewIcon fontSize="small" color="action" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Print Delivery">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() =>
                        router.push(
                          `/deliveries/${encodeURIComponent(
                            delivery.id
                          )}?print=true`
                        )
                      }
                    >
                      <PrintIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" color="error">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
