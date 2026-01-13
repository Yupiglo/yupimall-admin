"use client";

import { Box, CircularProgress, Typography, Stack } from "@mui/material";

interface PageLoaderProps {
  message?: string;
  fullScreen?: boolean;
}

export default function PageLoader({
  message = "Loading...",
  fullScreen = false,
}: PageLoaderProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: fullScreen ? "100vh" : "400px",
        width: "100%",
        bgcolor: "transparent",
      }}
    >
      <Stack spacing={3} alignItems="center">
        <Box sx={{ position: "relative", display: "inline-flex" }}>
          <CircularProgress
            size={60}
            thickness={4}
            sx={{
              color: "primary.main",
              "& .MuiCircularProgress-circle": {
                strokeLinecap: "round",
              },
            }}
          />
        </Box>
        <Typography
          variant="h6"
          fontWeight="medium"
          color="text.secondary"
          sx={{ opacity: 0.8 }}
        >
          {message}
        </Typography>
      </Stack>
    </Box>
  );
}
