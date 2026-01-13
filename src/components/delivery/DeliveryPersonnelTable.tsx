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
    Avatar,
    CircularProgress,
} from "@mui/material";
import {
    Visibility as ViewIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";

interface DeliveryPerson {
    id: number;
    name: string;
    email: string;
    phone?: string;
    image_url?: string;
    active_deliveries?: number;
    created_at: string;
}

interface DeliveryPersonnelTableProps {
    searchQuery?: string;
    onSelectPerson?: (person: DeliveryPerson) => void;
}

export default function DeliveryPersonnelTable({
    searchQuery = "",
    onSelectPerson,
}: DeliveryPersonnelTableProps) {
    const [personnel, setPersonnel] = useState<DeliveryPerson[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPersonnel();
    }, [searchQuery]);

    const fetchPersonnel = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/delivery/personnel", {
                params: { search: searchQuery || undefined },
            });
            setPersonnel(response.data.personnel || []);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch personnel:", err);
            setError("Failed to load delivery personnel");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ textAlign: "center", py: 6 }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    if (personnel.length === 0) {
        return (
            <Box sx={{ textAlign: "center", py: 6 }}>
                <Typography color="text.secondary">
                    No delivery personnel found.
                    {searchQuery && " Try adjusting your search."}
                </Typography>
            </Box>
        );
    }

    return (
        <TableContainer
            component={Paper}
            elevation={0}
            sx={{ borderRadius: "16px", border: "1px solid", borderColor: "divider" }}
        >
            <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ bgcolor: "background.default" }}>
                    <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>Personnel</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Contact</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Active Deliveries</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Joined</TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {personnel.map((person) => (
                        <TableRow
                            key={person.id}
                            hover
                            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                        >
                            <TableCell>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Avatar
                                        src={person.image_url}
                                        sx={{ width: 40, height: 40 }}
                                    >
                                        {person.name?.charAt(0)}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            {person.name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            ID: #{person.id}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </TableCell>
                            <TableCell>
                                <Stack spacing={0.5}>
                                    <Stack direction="row" spacing={0.5} alignItems="center">
                                        <EmailIcon sx={{ fontSize: 14 }} color="action" />
                                        <Typography variant="caption">{person.email}</Typography>
                                    </Stack>
                                    {person.phone && (
                                        <Stack direction="row" spacing={0.5} alignItems="center">
                                            <PhoneIcon sx={{ fontSize: 14 }} color="action" />
                                            <Typography variant="caption">{person.phone}</Typography>
                                        </Stack>
                                    )}
                                </Stack>
                            </TableCell>
                            <TableCell>
                                <Chip
                                    label={`${person.active_deliveries || 0} active`}
                                    size="small"
                                    color={person.active_deliveries ? "primary" : "default"}
                                    variant="outlined"
                                    sx={{ fontWeight: 500, borderRadius: "100px" }}
                                />
                            </TableCell>
                            <TableCell sx={{ color: "text.secondary" }}>
                                {new Date(person.created_at).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                })}
                            </TableCell>
                            <TableCell align="right">
                                <Stack direction="row" spacing={1} justifyContent="flex-end">
                                    <Tooltip title="View Details">
                                        <IconButton
                                            size="small"
                                            onClick={() => onSelectPerson?.(person)}
                                        >
                                            <ViewIcon fontSize="small" color="action" />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
