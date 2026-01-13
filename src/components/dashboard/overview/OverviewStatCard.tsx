"use client";

import { Box, Card, CardContent, Stack, Typography, Divider, Avatar } from "@mui/material";
import React from "react";

interface StatItemProps {
    label: string;
    value: string | number;
    subValue?: string;
}

const StatItem = ({ label, value, subValue }: StatItemProps) => (
    <Box sx={{ flex: 1, textAlign: "left" }}>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 0.5 }}>
            {value}
        </Typography>
        <Typography variant="caption" color="text.secondary" fontWeight="medium">
            {label}
        </Typography>
    </Box>
);

interface OverviewStatCardProps {
    title: string;
    icon: React.ReactNode;
    primaryLabel: string;
    primaryValue: string | number;
    secondaryLabel: string;
    secondaryValue: string | number;
    iconBgColor?: string;
    iconColor?: string;
}

export default function OverviewStatCard({
    title,
    icon,
    primaryLabel,
    primaryValue,
    secondaryLabel,
    secondaryValue,
    iconBgColor = "primary.light",
    iconColor = "primary.main",
}: OverviewStatCardProps) {
    return (
        <Card sx={{ borderRadius: "20px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", border: "1px solid", borderColor: "divider" }}>
            <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                    <Avatar
                        sx={{
                            bgcolor: iconBgColor,
                            color: iconColor,
                            width: 44,
                            height: 44,
                            borderRadius: "12px",
                        }}
                    >
                        {icon}
                    </Avatar>
                    <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
                        {title}
                    </Typography>
                </Stack>

                <Divider sx={{ mb: 2, borderStyle: "dashed" }} />

                <Stack direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: "dashed" }} />}>
                    <StatItem label={primaryLabel} value={primaryValue} />
                    <StatItem label={secondaryLabel} value={secondaryValue} />
                </Stack>
            </CardContent>
        </Card>
    );
}
