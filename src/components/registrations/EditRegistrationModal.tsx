"use client";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    TextField,
    MenuItem,
    Stack,
    CircularProgress,
    Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import axiosInstance from "../../lib/axios";

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

interface EditRegistrationModalProps {
    open: boolean;
    onClose: () => void;
    registration: Registration;
    onSuccess: (updatedReg: Registration) => void;
}

export default function EditRegistrationModal({
    open,
    onClose,
    registration,
    onSuccess,
}: EditRegistrationModalProps) {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        country: "",
        plan: "",
        payment_method: "",
        status: "",
        requested_role: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (registration) {
            setFormData({
                first_name: registration.first_name,
                last_name: registration.last_name,
                username: registration.username,
                email: registration.email,
                phone: registration.phone || "",
                address: registration.address || "",
                city: registration.city || "",
                country: registration.country || "",
                plan: registration.plan,
                payment_method: registration.payment_method,
                status: registration.status,
                requested_role: registration.requested_role || "stockist",
            });
        }
    }, [registration]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await axiosInstance.put(`registrations/${registration.id}`, formData);
            onSuccess(response.data.registration);
            onClose();
        } catch (err: any) {
            console.error("Failed to update registration:", err);
            setError(err.response?.data?.message || "Erreur lors de la mise à jour");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Modifier l'inscription</DialogTitle>
            <DialogContent dividers>
                {error && (
                    <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            name="first_name"
                            label="Prénom"
                            fullWidth
                            value={formData.first_name}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            name="last_name"
                            label="Nom"
                            fullWidth
                            value={formData.last_name}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            name="username"
                            label="Username"
                            fullWidth
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            name="email"
                            label="Email"
                            fullWidth
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            name="phone"
                            label="Téléphone"
                            fullWidth
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            name="plan"
                            select
                            label="Pack"
                            fullWidth
                            value={formData.plan}
                            onChange={handleChange}
                        >
                            <MenuItem value="silver">Silver</MenuItem>
                            <MenuItem value="gold">Gold</MenuItem>
                            <MenuItem value="platinum">Platinum</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            name="status"
                            select
                            label="Statut"
                            fullWidth
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <MenuItem value="pending">En attente</MenuItem>
                            <MenuItem value="approved">Approuvé</MenuItem>
                            <MenuItem value="rejected">Refusé</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            name="requested_role"
                            select
                            label="Rôle Demandé"
                            fullWidth
                            value={formData.requested_role}
                            onChange={handleChange}
                        >
                            <MenuItem value="stockist">Stockist</MenuItem>
                            <MenuItem value="warehouse">Warehouse</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            name="payment_method"
                            label="Paiement"
                            fullWidth
                            value={formData.payment_method}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid size={12}>
                        <TextField
                            name="address"
                            label="Adresse"
                            fullWidth
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            name="city"
                            label="Ville"
                            fullWidth
                            value={formData.city}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            name="country"
                            label="Pays"
                            fullWidth
                            value={formData.country}
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} color="inherit">Annuler</Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading}
                    startIcon={loading && <CircularProgress size={20} />}
                >
                    Enregistrer
                </Button>
            </DialogActions>
        </Dialog>
    );
}
