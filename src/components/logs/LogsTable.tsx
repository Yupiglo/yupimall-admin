"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
  Box,
  Stack,
  Pagination,
  CircularProgress,
  Alert,
} from "@mui/material";
import axiosInstance from "@/lib/axios";

interface LogEntry {
  id: number;
  level: string;
  action: string;
  description: string;
  ip_address: string;
  created_at: string;
  user?: {
    name: string;
  };
}

const getLevelColor = (level: string) => {
  switch (level.toLowerCase()) {
    case "info":
      return "info";
    case "warning":
      return "warning";
    case "error":
      return "error";
    case "success":
      return "success";
    default:
      return "default";
  }
};

interface LogsTableProps {
  endpoint?: "admin" | "dev";
}

export default function LogsTable({ endpoint = "admin" }: LogsTableProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`${endpoint}/logs?page=${page}`);
      setLogs(response.data.logs.data);
      setTotalPages(response.data.logs.last_page);
    } catch (err) {
      console.error("Failed to fetch logs:", err);
      setError("Failed to load logs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, endpoint]);

  const handlePageChange = (_: any, value: number) => {
    setPage(value);
  };

  if (loading && logs.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 4 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: "16px",
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: "background.default" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Level</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Timestamp</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>User</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.length > 0 ? (
              logs.map((log) => (
                <TableRow
                  key={log.id}
                  hover
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>
                    <Chip
                      label={log.level}
                      size="small"
                      color={getLevelColor(log.level) as any}
                      variant="outlined"
                      sx={{
                        fontWeight: 600,
                        borderRadius: "100px",
                        px: 0.5,
                        minWidth: 80,
                      }}
                    />
                  </TableCell>
                  <TableCell
                    sx={{ color: "text.secondary", whiteSpace: "nowrap" }}
                  >
                    {new Date(log.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell sx={{ fontWeight: "medium" }}>
                    {log.user?.name || "System"}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {log.action}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ color: "text.secondary" }}>
                    {log.description}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  No logs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Stack direction="row" justifyContent="center" sx={{ mt: 4, mb: 2 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            sx={{
              "& .MuiPaginationItem-root": { borderRadius: "10px" },
            }}
          />
        </Stack>
      )}
    </Box>
  );
}
