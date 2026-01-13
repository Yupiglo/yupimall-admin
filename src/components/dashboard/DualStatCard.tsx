"use client";

import { Box, Card, CardContent, Stack, Typography } from "@mui/material";

type DualStatCardProps = {
    title: string;
    icon: React.ReactNode;
    value1: string | number;
    label1: string;
    value2: string | number;
    label2: string;
    iconBgColor?: string;
};

export default function DualStatCard({
    title,
    icon,
    value1,
    label1,
    value2,
    label2,
    iconBgColor = "#e5e7eb",
}: DualStatCardProps) {
    return (
        <Card
            sx={{
                borderRadius: 4,
                border: "1px solid",
                borderColor: "#f3f4f6",
                bgcolor: "background.paper",
                boxShadow: "none",
                transition: "all 0.25s ease",
                cursor: "pointer",
                // Subtle hover effect - light transparent overlay
                "&:hover": {
                    borderColor: "rgba(143, 28, 210, 0.3)",
                    bgcolor: "rgba(143, 28, 210, 0.04)", // Very light violet tint
                    boxShadow: "0 2px 12px rgba(143, 28, 210, 0.08)",
                    // Subtle color changes
                    "& .card-title": {
                        color: "#8f1cd2",
                    },
                    "& .card-icon-box": {
                        bgcolor: "rgba(143, 28, 210, 0.1)",
                        color: "#8f1cd2",
                    },
                },
            }}
        >
            <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
                {/* Header with icon and title */}
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                    <Box
                        className="card-icon-box"
                        sx={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: iconBgColor,
                            color: "#6b7280",
                            transition: "all 0.25s ease",
                            "& svg": { fontSize: 16 },
                        }}
                    >
                        {icon}
                    </Box>
                    <Typography
                        className="card-title"
                        variant="body2"
                        fontWeight="medium"
                        color="text.secondary"
                        sx={{ transition: "all 0.25s ease" }}
                    >
                        {title}
                    </Typography>
                </Stack>

                {/* Two columns of stats - positioned on each side */}
                <Stack direction="row" justifyContent="space-between" sx={{ px: 1 }}>
                    <Box>
                        <Typography
                            variant="h4"
                            fontWeight="bold"
                            color="text.primary"
                            sx={{ lineHeight: 1.2 }}
                        >
                            {value1}
                        </Typography>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontSize: "0.7rem" }}
                        >
                            {label1}
                        </Typography>
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                        <Typography
                            variant="h4"
                            fontWeight="bold"
                            color="text.primary"
                            sx={{ lineHeight: 1.2 }}
                        >
                            {value2}
                        </Typography>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontSize: "0.7rem" }}
                        >
                            {label2}
                        </Typography>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
}
