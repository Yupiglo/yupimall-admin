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
  Avatar,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";

const couriers = [
  {
    id: "#COU-001",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 890",
    vehicle: "Motorcycle",
    deliveries: 124,
    status: "Active",
  },
  {
    id: "#COU-002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1 234 567 891",
    vehicle: "Bicycle",
    deliveries: 85,
    status: "Active",
  },
  {
    id: "#COU-003",
    name: "Mike Tyson",
    email: "mike.t@example.com",
    phone: "+1 234 567 892",
    vehicle: "Car",
    deliveries: 210,
    status: "On Delivery",
  },
  {
    id: "#COU-004",
    name: "Sarah Connor",
    email: "sarah.c@example.com",
    phone: "+1 234 567 893",
    vehicle: "Van",
    deliveries: 45,
    status: "Offline",
  },
];

export default function CouriersTable() {
  const router = useRouter();
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "success";
      case "On Delivery":
        return "info";
      case "Offline":
        return "default";
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
            <TableCell sx={{ fontWeight: "bold" }}>Courier</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Contact Info</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Vehicle</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Total Deliveries</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {couriers.map((courier) => (
            <TableRow
              key={courier.id}
              hover
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: "primary.light",
                      color: "primary.main",
                      fontWeight: "bold",
                    }}
                  >
                    {courier.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {courier.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {courier.id}
                    </Typography>
                  </Box>
                </Stack>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="body2">{courier.email}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {courier.phone}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: "medium" }}>
                {courier.vehicle}
              </TableCell>
              <TableCell sx={{ fontWeight: "medium" }}>
                {courier.deliveries}
              </TableCell>
              <TableCell>
                <Chip
                  label={courier.status}
                  color={getStatusColor(courier.status) as any}
                  size="small"
                  variant="outlined"
                />
              </TableCell>
              <TableCell align="right">
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <Tooltip title="View Profile">
                    <IconButton
                      size="small"
                      onClick={() =>
                        router.push(
                          `/couriers/${encodeURIComponent(courier.id)}`
                        )
                      }
                    >
                      <ViewIcon fontSize="small" color="action" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit Info">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() =>
                        router.push(
                          `/couriers/${encodeURIComponent(courier.id)}/edit`
                        )
                      }
                    >
                      <EditIcon fontSize="small" />
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
