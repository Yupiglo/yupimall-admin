"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
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
  Edit as EditIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import axios from "@/lib/axios";
import { useContext } from "react";
import { CurrencyContext } from "@/helpers/currency/CurrencyContext";

interface StockEntry {
  id: number;
  product_id: number;
  user_id: number;
  quantity: number;
  unit_price: string | null;
  supplier: string | null;
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
}

interface EntriesTableProps {
  searchQuery?: string;
  onRefresh?: () => void;
  refreshTrigger?: number;
}

export default function EntriesTable({ searchQuery = "", refreshTrigger = 0 }: EntriesTableProps) {
  const router = useRouter();
  const [entries, setEntries] = useState<StockEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleting, setDeleting] = useState<number | null>(null);
  const { selectedCurr } = useContext(CurrencyContext);

  const fetchEntries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params: Record<string, unknown> = { page, per_page: 10 };
      if (searchQuery) params.search = searchQuery;

      const response = await axios.get("/stock/entries", { params });
      setEntries(response.data.data || []);
      setTotalPages(response.data.last_page || 1);
    } catch (err) {
      console.error("Error fetching entries:", err);
      setError("Failed to load stock entries. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries, refreshTrigger]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this entry? This will decrease the product stock.")) {
      return;
    }

    try {
      setDeleting(id);
      await axios.delete(`/stock/entries/${id}`);
      fetchEntries();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      alert(error.response?.data?.message || "Failed to delete entry");
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

  const formatPrice = (price: string | null) => {
    if (!price) return "-";
    const converted = parseFloat(price) * selectedCurr.value;

    // For currencies like FCFA or Naira, show as integer (no decimals)
    if (selectedCurr.symbol === "FCFA" || selectedCurr.symbol === "₦") {
      return `${Math.round(converted).toLocaleString()} ${selectedCurr.symbol}`;
    }

    // For others, keep decimals
    return `${selectedCurr.symbol}${converted.toFixed(2)}`;
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

  if (entries.length === 0) {
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
          No stock entries found. Add your first entry to get started.
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
              <TableCell sx={{ fontWeight: "bold" }}>Unit Price</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Supplier</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Created By</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.map((entry) => (
              <TableRow
                key={entry.id}
                hover
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell sx={{ fontWeight: "medium" }}>#{entry.id}</TableCell>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    {entry.product?.img_cover && (
                      <Box
                        component="img"
                        src={entry.product.img_cover}
                        alt={entry.product.title}
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: "8px",
                          objectFit: "cover",
                        }}
                      />
                    )}
                    <Typography variant="subtitle2" fontWeight="bold">
                      {entry.product?.title || "Unknown Product"}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Typography fontWeight="medium" color="success.main">
                    +{entry.quantity}
                  </Typography>
                </TableCell>
                <TableCell sx={{ color: "text.secondary" }}>
                  {formatPrice(entry.unit_price)}
                </TableCell>
                <TableCell sx={{ color: "text.secondary" }}>
                  {entry.supplier || "-"}
                </TableCell>
                <TableCell sx={{ color: "text.secondary" }}>
                  {formatDate(entry.created_at)}
                </TableCell>
                <TableCell sx={{ color: "text.secondary" }}>
                  {entry.user?.name || "Unknown"}
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => router.push(`/entries/${entry.id}`)}
                      >
                        <ViewIcon fontSize="small" color="action" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(entry.id)}
                        disabled={deleting === entry.id}
                      >
                        {deleting === entry.id ? (
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
