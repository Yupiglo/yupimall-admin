"use client";

import {
  Stack,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Box,
  MenuItem,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as ExportIcon,
} from "@mui/icons-material";

export default function LogsHeader() {
  return (
    <Box sx={{ mb: 4 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            System Logs
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Monitor system activities, audits, and errors in real-time.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<ExportIcon />}
          sx={{
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: "bold",
          }}
        >
          Export Logs
        </Button>
      </Stack>

      <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mt: 4 }}>
        <TextField
          placeholder="Search logs by user, action or description..."
          size="small"
          fullWidth
          sx={{
            maxWidth: { md: 400 },
            "& .MuiOutlinedInput-root": { borderRadius: "12px" },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            },
          }}
        />
        <Stack
          direction="row"
          spacing={2}
          sx={{ width: { xs: "100%", md: "auto" } }}
        >
          <TextField
            select
            label="Level"
            size="small"
            defaultValue="all"
            sx={{
              minWidth: 120,
              "& .MuiOutlinedInput-root": { borderRadius: "12px" },
            }}
          >
            <MenuItem value="all">All Levels</MenuItem>
            <MenuItem value="info">Info</MenuItem>
            <MenuItem value="warning">Warning</MenuItem>
            <MenuItem value="error">Error</MenuItem>
            <MenuItem value="success">Success</MenuItem>
          </TextField>
          <Button
            variant="contained"
            startIcon={<FilterIcon />}
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: "bold",
              px: 3,
              boxShadow: "none",
            }}
          >
            Filter
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
