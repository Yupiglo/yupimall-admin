"use client";

import { Box, Card, CardContent, Typography, Stack, Avatar, IconButton } from "@mui/material";
import React from "react";
import EmailIcon from "@mui/icons-material/EmailOutlined";
import PhoneIcon from "@mui/icons-material/PhoneOutlined";

const members = [
    { name: "John Smith", role: "Manager", avatar: "JS", status: "online" },
    { name: "Anastasya Primo", role: "Digital Marketing", avatar: "AP", status: "offline" },
    { name: "Colt Heist", role: "Digital Marketing", avatar: "CH", status: "offline" },
];

export default function TeamMembers() {
    return (
        <Card sx={{ borderRadius: "20px", border: "1px solid", borderColor: "divider" }}>
            <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>Team Members</Typography>
                <Stack spacing={3}>
                    {members.map((member, index) => (
                        <Stack key={index} direction="row" alignItems="center" justifyContent="space-between">
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <Box sx={{ position: "relative" }}>
                                    <Avatar sx={{ bgcolor: "primary.light", color: "primary.main", fontWeight: "bold" }}>
                                        {member.avatar}
                                    </Avatar>
                                    {member.status === "online" && (
                                        <Box sx={{
                                            position: "absolute", bottom: 0, right: 0, width: 12, height: 12,
                                            bgcolor: "error.main", borderRadius: "50%", border: "2px solid white"
                                        }} />
                                    )}
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" fontWeight="bold">{member.name}</Typography>
                                    <Typography variant="caption" color="text.secondary">{member.role}</Typography>
                                </Box>
                            </Stack>
                            <Stack direction="row" spacing={1}>
                                <IconButton size="small" sx={{ border: "1px solid", borderColor: "divider", borderRadius: "8px" }}>
                                    <EmailIcon fontSize="small" />
                                </IconButton>
                                <IconButton size="small" sx={{ border: "1px solid", borderColor: "divider", borderRadius: "8px" }}>
                                    <PhoneIcon fontSize="small" />
                                </IconButton>
                            </Stack>
                        </Stack>
                    ))}
                </Stack>
            </CardContent>
        </Card>
    );
}
