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
  CircularProgress,
  Alert,
  Pagination,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import axios from "@/lib/axios";

interface StockExit {
  id: number;
  product_id: number;
  user_id: number;
  order_id: number | null;
  quantity: number;
  reason: string;
  reference: string | null;
  notes: string | null;
  created_at: string;
  product: {
    id: number;
    title: string;
    img_cover: string | null;
  };
  user: {
    id: number;
    name: string;
  };
  order?: {
    id: number;
    tracking_code: string;
  };
}

interface ExitsTableProps {
  searchQuery?: string;
  onRefresh?: () => void;
  refreshTrigger?: number;
}

const reasonLabels: Record<string, string> = {
  sale: "Sale",
  damaged: "Damaged",
  expired: "Expired",
  returned: "Returned",
  other: "Other",
};

const reasonColors: Record<string, "success" | "error" | "warning" | "info" | "default"> = {
  sale: "success",
  damaged: "error",
  expired: "warning",
  returned: "info",
  other: "default",
};

export default function ExitsTable({ searchQuery = "", refreshTrigger = 0 }: ExitsTableProps) {
  const router = useRouter();
  const [exits, setExits] = useState<StockExit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleting, setDeleting] = useState<number | null>(null);

  const fetchExits = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params: Record<string, unknown> = { page, per_page: 10 };
      if (searchQuery) params.search = searchQuery;

      const response = await axios.get("/stock/exits", { params });
      setExits(response.data.data || []);
      setTotalPages(response.data.last_page || 1);
    } catch (err) {
      console.error("Error fetching exits:", err);
      setError("Failed to load stock exits. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery]);

  useEffect(() => {
    fetchExits();
  }, [fetchExits, refreshTrigger]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this exit? This will restore the product stock.")) {
      return;
    }

    try {
      setDeleting(id);
      await axios.delete(`/stock/exits/${id}`);
      fetchExits();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      alert(error.response?.data?.message || "Failed to delete exit");
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ borderRadius: "12px" }}>
        {error}
      </Alert>
    );
  }

  if (exits.length === 0) {
    return (
      <Paper
        sx={{
          p: 4,
          textAlign: "center",
          borderRadius: "16px",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography color="text.secondary">
          No stock exits found. Register your first exit to get started.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ borderRadius: "16px", border: "1px solid", borderColor: "divider" }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: "background.default" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Product</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Quantity</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Reason</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Order</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Created By</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {exits.map((exit) => (
              <TableRow
                key={exit.id}
                hover
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell sx={{ fontWeight: "medium" }}>#{exit.id}</TableCell>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    {exit.product?.img_cover && (
                      <Box
                        component="img"
                        src={exit.product.img_cover}
                        alt={exit.product.title}
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: "8px",
                          objectFit: "cover",
                        }}
                      />
                    )}
                    <Typography variant="subtitle2" fontWeight="bold">
                      {exit.product?.title || "Unknown Product"}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Typography fontWeight="medium" color="error.main">
                    -{exit.quantity}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={reasonLabels[exit.reason] || exit.reason}
                    color={reasonColors[exit.reason] || "default"}
                    size="small"
                    variant="outlined"
                    sx={{
                      fontWeight: 500,
                      borderRadius: "100px",
                      px: 0.5,
                    }}
                  />
                </TableCell>
                <TableCell sx={{ color: "text.secondary" }}>
                  {exit.order?.tracking_code || "-"}
                </TableCell>
                <TableCell sx={{ color: "text.secondary" }}>
                  {formatDate(exit.created_at)}
                </TableCell>
                <TableCell sx={{ color: "text.secondary" }}>
                  {exit.user?.name || "Unknown"}
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => router.push(`/exits/${exit.id}`)}
                      >
                        <ViewIcon fontSize="small" color="action" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(exit.id)}
                        disabled={deleting === exit.id}
                      >
                        {deleting === exit.id ? (
                          <CircularProgress size={18} />
                        ) : (
                          <DeleteIcon fontSize="small" />
                        )}
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
}
