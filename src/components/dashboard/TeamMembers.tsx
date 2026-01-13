"use client";

import { useState, useEffect } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Stack,
    Avatar,
    IconButton,
    CircularProgress,
} from "@mui/material";
import { Email as EmailIcon } from "@mui/icons-material";
import axiosInstance from "@/lib/axios";

interface TeamMember {
    id: string;
    name: string;
    role: string;
    image?: string;
    email?: string;
}

export default function TeamMembers() {
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const response = await axiosInstance.get("admin/stats");
                setMembers(response.data.teamMembers || []);
            } catch (error) {
                console.error("Failed to fetch team members:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTeam();
    }, []);

    return (
        <Card
            sx={{
                borderRadius: 4,
                border: "1px solid",
                borderColor: "#f3f4f6",
                boxShadow: "none",
                height: "100%",
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Typography
                    variant="h6"
                    fontWeight="bold"
                    color="text.primary"
                    sx={{ mb: 3 }}
                >
                    Team Members
                </Typography>

                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                        <CircularProgress size={32} />
                    </Box>
                ) : members.length === 0 ? (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            py: 4,
                            bgcolor: "#f9fafb",
                            borderRadius: 3,
                        }}
                    >
                        <Typography sx={{ fontSize: "2rem", mb: 1 }}>👥</Typography>
                        <Typography color="text.secondary" variant="body2">
                            Aucun membre d'équipe trouvé
                        </Typography>
                    </Box>
                ) : (
                    <Stack spacing={2}>
                        {members.map((member) => (
                            <Stack
                                key={member.id}
                                direction="row"
                                alignItems="center"
                                justifyContent="space-between"
                                sx={{ py: 1 }}
                            >
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Avatar
                                        src={member.image}
                                        alt={member.name}
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            bgcolor: "primary.light",
                                            color: "primary.main",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {member.name.charAt(0).toUpperCase()}
                                    </Avatar>
                                    <Box>
                                        <Typography
                                            variant="body2"
                                            fontWeight="medium"
                                            color="text.primary"
                                        >
                                            {member.name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: "capitalize" }}>
                                            {member.role?.replace("_", " ")}
                                        </Typography>
                                    </Box>
                                </Stack>

                                <IconButton
                                    size="small"
                                    href={`mailto:${member.email}`}
                                    sx={{
                                        width: 32,
                                        height: 32,
                                        bgcolor: "#f3f4f6",
                                        color: "#6b7280",
                                        "&:hover": { bgcolor: "#e5e7eb" },
                                    }}
                                >
                                    <EmailIcon sx={{ fontSize: 16 }} />
                                </IconButton>
                            </Stack>
                        ))}
                    </Stack>
                )}
            </CardContent>
        </Card>
    );
}
