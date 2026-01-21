"use client";

import { useState, useEffect, useMemo } from "react";
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
    Chip,
    Avatar,
    CircularProgress,
    Alert,
} from "@mui/material";
import {
    Visibility as ViewIcon,
    CheckCircle as ApproveIcon,
    Cancel as RejectIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
} from "@mui/icons-material";
import axiosInstance from "../../lib/axios";
import ViewRegistrationModal from "./ViewRegistrationModal";
import EditRegistrationModal from "./EditRegistrationModal";

interface Registration {
    id: number;
    sponsor_id: string;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    zip_code: string;
    plan: string;
    payment_method: string;
    status: string;
    requested_role: string;
    created_at: string;
}

interface RegistrationsTableProps {
    searchQuery: string;
    refreshTrigger: number;
}

export default function RegistrationsTable({
    searchQuery,
    refreshTrigger,
}: RegistrationsTableProps) {
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedReg, setSelectedReg] = useState<Registration | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        const fetchRegistrations = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get("registrations");
                setRegistrations(response.data.registrations || []);
            } catch (err: any) {
                console.error("Failed to fetch registrations:", err);
                setError("Impossible de charger les inscriptions");
            } finally {
                setLoading(false);
            }
        };

        fetchRegistrations();
    }, [refreshTrigger]);

    const filteredRegistrations = useMemo(() => {
        return registrations.filter((reg) => {
            const search = searchQuery.toLowerCase();
            return (
                reg.first_name.toLowerCase().includes(search) ||
                reg.last_name.toLowerCase().includes(search) ||
                reg.email.toLowerCase().includes(search) ||
                reg.username.toLowerCase().includes(search) ||
                reg.plan.toLowerCase().includes(search)
            );
        });
    }, [registrations, searchQuery]);

    const getStatusChip = (status: string) => {
        switch (status) {
            case "approved":
                return (
                    <Chip
                        label="Approuvé"
                        size="small"
                        sx={{
                            bgcolor: "success.main",
                            color: "white",
                            fontWeight: "bold",
                            borderRadius: "6px"
                        }}
                    />
                );
            case "rejected":
                return (
                    <Chip
                        label="Refusé"
                        size="small"
                        sx={{
                            bgcolor: "error.main",
                            color: "white",
                            fontWeight: "bold",
                            borderRadius: "6px"
                        }}
                    />
                );
            default:
                return (
                    <Chip
                        label="En attente"
                        size="small"
                        sx={{
                            bgcolor: "warning.main",
                            color: "white",
                            fontWeight: "bold",
                            borderRadius: "6px"
                        }}
                    />
                );
        }
    };

    const handleUpdateStatus = async (id: number, status: string) => {
        if (!confirm(`Changer le statut en ${status} ?`)) return;
        try {
            await axiosInstance.put(`registrations/${id}`, { status });
            setRegistrations((prev) =>
                prev.map((r) => (r.id === id ? { ...r, status } : r))
            );
        } catch (err) {
            console.error("Failed to update status:", err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Voulez-vous vraiment supprimer cette inscription ? Cette action est irréversible.")) return;
        try {
            await axiosInstance.delete(`registrations/${id}`);
            setRegistrations((prev) => prev.filter((r) => r.id !== id));
        } catch (err) {
            console.error("Failed to delete registration:", err);
            alert("Erreur lors de la suppression");
        }
    };

    const handleEdit = (reg: Registration) => {
        setSelectedReg(reg);
        setIsEditModalOpen(true);
    };

    const handleEditSuccess = (updatedReg: Registration) => {
        setRegistrations((prev) =>
            prev.map((r) => (r.id === updatedReg.id ? updatedReg : r))
        );
    };

    const handleViewDetails = (reg: Registration) => {
        setSelectedReg(reg);
        setIsViewModalOpen(true);
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    return (
        <Stack spacing={2}>
            <TableContainer
                component={Paper}
                elevation={0}
                sx={{ borderRadius: "16px", border: "1px solid", borderColor: "divider" }}
            >
                <Table sx={{ minWidth: 650 }}>
                    <TableHead sx={{ bgcolor: "background.default" }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>Client</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Pack</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Paiement</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Rôle</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Statut</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                            <TableCell align="right" sx={{ fontWeight: "bold" }}>
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredRegistrations.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                    <Typography color="text.secondary">
                                        Aucune inscription trouvée
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                        {filteredRegistrations.map((reg) => (
                            <TableRow key={reg.id} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                <TableCell>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Avatar
                                            sx={{
                                                width: 40,
                                                height: 40,
                                                bgcolor: "primary.main",
                                                color: "white",
                                                fontWeight: "bold",
                                                borderRadius: "12px"
                                            }}
                                        >
                                            {reg.first_name.charAt(0).toUpperCase()}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight="bold">
                                                {reg.first_name} {reg.last_name}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {reg.email}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={reg.plan.toUpperCase()}
                                        size="small"
                                        sx={{
                                            borderRadius: "6px",
                                            fontWeight: "bold",
                                            fontSize: "0.65rem",
                                            bgcolor: reg.plan.toLowerCase() === 'platinum' ? 'info.main' : 'warning.main',
                                            color: 'white'
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" color="text.primary" sx={{ textTransform: "capitalize" }}>
                                        {reg.payment_method.replace("_", " ")}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={reg.requested_role === 'warehouse' ? 'Warehouse' : 'Stockist'}
                                        size="small"
                                        variant="outlined"
                                        color={reg.requested_role === 'warehouse' ? 'secondary' : 'default'}
                                        sx={{ borderRadius: "6px", fontWeight: "bold", fontSize: "0.65rem" }}
                                    />
                                </TableCell>
                                <TableCell>{getStatusChip(reg.status)}</TableCell>
                                <TableCell sx={{ color: "text.secondary", fontSize: "0.85rem" }}>
                                    {new Date(reg.created_at).toLocaleDateString("fr-FR")}
                                </TableCell>
                                <TableCell align="right">
                                    <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                                        <Tooltip title="Détails">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleViewDetails(reg)}
                                            >
                                                <ViewIcon fontSize="small" color="action" />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title="Modifier">
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                onClick={() => handleEdit(reg)}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>

                                        {reg.status === "pending" && (
                                            <>
                                                <Tooltip title="Approuver">
                                                    <IconButton
                                                        size="small"
                                                        color="success"
                                                        onClick={() => handleUpdateStatus(reg.id, "approved")}
                                                    >
                                                        <ApproveIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Rejeter">
                                                    <IconButton
                                                        size="small"
                                                        color="warning"
                                                        onClick={() => handleUpdateStatus(reg.id, "rejected")}
                                                    >
                                                        <RejectIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </>
                                        )}

                                        <Tooltip title="Supprimer">
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleDelete(reg.id)}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Typography variant="body2" color="text.secondary" sx={{ textAlign: "right", px: 1 }}>
                {filteredRegistrations.length} inscription(s) affichée(s)
            </Typography>

            {selectedReg && (
                <ViewRegistrationModal
                    open={isViewModalOpen}
                    onClose={() => setIsViewModalOpen(false)}
                    registration={selectedReg}
                />
            )}

            {selectedReg && (
                <EditRegistrationModal
                    open={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    registration={selectedReg}
                    onSuccess={handleEditSuccess}
                />
            )}
        </Stack>
    );
}
