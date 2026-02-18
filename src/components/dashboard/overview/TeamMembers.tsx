"use client";

import { Box, Card, CardContent, Typography, Stack, Avatar, IconButton, CircularProgress } from "@mui/material";
import React, { useState, useEffect } from "react";
import EmailIcon from "@mui/icons-material/EmailOutlined";
import PhoneIcon from "@mui/icons-material/PhoneOutlined";
import axiosInstance from "@/lib/axios";

export default function TeamMembers() {
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const response = await axiosInstance.get("users");
                const allUsers = response.data?.users?.data || response.data?.users || response.data?.data || [];
                const team = (Array.isArray(allUsers) ? allUsers : [])
                    .filter((u: any) => u.role === "admin" || u.role === "dev" || u.role === "stockist")
                    .slice(0, 5);
                setMembers(team);
            } catch (err) {
                console.error("Failed to load team members:", err);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    return (
        <Card sx={{ borderRadius: "20px", border: "1px solid", borderColor: "divider" }}>
            <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>Membres de l&apos;équipe</Typography>
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                        <CircularProgress size={24} />
                    </Box>
                ) : members.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
                        Aucun membre trouvé
                    </Typography>
                ) : (
                    <Stack spacing={3}>
                        {members.map((member, index) => (
                            <Stack key={member.id || index} direction="row" alignItems="center" justifyContent="space-between">
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <Avatar
                                        src={member.avatar || member.image || undefined}
                                        sx={{ bgcolor: "primary.light", color: "primary.main", fontWeight: "bold" }}
                                    >
                                        {member.name?.charAt(0).toUpperCase() || "?"}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="subtitle2" fontWeight="bold">{member.name}</Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: "capitalize" }}>
                                            {member.role}
                                        </Typography>
                                    </Box>
                                </Stack>
                                <Stack direction="row" spacing={1}>
                                    {member.email && (
                                        <IconButton
                                            size="small"
                                            component="a"
                                            href={`mailto:${member.email}`}
                                            sx={{ border: "1px solid", borderColor: "divider", borderRadius: "8px" }}
                                        >
                                            <EmailIcon fontSize="small" />
                                        </IconButton>
                                    )}
                                    {member.phone && (
                                        <IconButton
                                            size="small"
                                            component="a"
                                            href={`tel:${member.phone}`}
                                            sx={{ border: "1px solid", borderColor: "divider", borderRadius: "8px" }}
                                        >
                                            <PhoneIcon fontSize="small" />
                                        </IconButton>
                                    )}
                                </Stack>
                            </Stack>
                        ))}
                    </Stack>
                )}
            </CardContent>
        </Card>
    );
}
