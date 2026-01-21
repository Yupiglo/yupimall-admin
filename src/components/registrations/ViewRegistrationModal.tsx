"use client";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Typography,
    Box,
    Divider,
    Avatar,
    Stack,
    Paper,
    Chip,
} from "@mui/material";
import {
    Person as PersonIcon,
    Home as HomeIcon,
    Star as PlanIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    Badge as BadgeIcon,
} from "@mui/icons-material";

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

interface ViewRegistrationModalProps {
    open: boolean;
    onClose: () => void;
    registration: Registration;
}

export default function ViewRegistrationModal({
    open,
    onClose,
    registration,
}: ViewRegistrationModalProps) {
    const DataItem = ({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) => (
        <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary" fontWeight="bold" sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {icon} {label}
            </Typography>
            <Typography variant="body1" fontWeight="600" color="text.primary">
                {value || "-"}
            </Typography>
        </Box>
    );

    const SectionHeader = ({ title, icon }: { title: string; icon: React.ReactNode }) => (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2, mt: 1 }}>
            <Box sx={{ color: "primary.main", display: "flex" }}>{icon}</Box>
            <Typography variant="subtitle1" fontWeight="bold" color="primary.main">
                {title}
            </Typography>
        </Stack>
    );

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: { borderRadius: "24px", overflow: "hidden" }
            }}
        >
            <DialogTitle sx={{ p: 3, bgcolor: "background.default" }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                        sx={{
                            width: 56,
                            height: 56,
                            bgcolor: "primary.main",
                            color: "white",
                            fontSize: "1.5rem",
                            fontWeight: "bold",
                            boxShadow: "0 4px 12px rgba(143, 28, 210, 0.3)"
                        }}
                    >
                        {registration.first_name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                        <Typography variant="h5" fontWeight="bold">
                            {registration.first_name} {registration.last_name}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="body2" color="text.secondary">
                                @{registration.username}
                            </Typography>
                            <Box sx={{ width: 4, height: 4, borderRadius: "50%", bgcolor: "divider" }} />
                            <Chip
                                label={registration.plan.toUpperCase()}
                                size="small"
                                sx={{
                                    borderRadius: "6px",
                                    fontWeight: "bold",
                                    fontSize: "0.75rem",
                                    bgcolor: registration.plan.toLowerCase() === 'platinum' ? 'info.main' : 'warning.main',
                                    color: 'white'
                                }}
                            />
                            <Chip
                                label={registration.requested_role === 'warehouse' ? 'Warehouse' : 'Stockist'}
                                size="small"
                                variant="outlined"
                                color={registration.requested_role === 'warehouse' ? 'secondary' : 'default'}
                                sx={{ borderRadius: "6px", fontWeight: "bold", fontSize: "0.75rem" }}
                            />
                        </Stack>
                    </Box>
                </Stack>
            </DialogTitle>

            <Divider />

            <DialogContent sx={{ p: 3 }}>
                <Grid container spacing={4}>
                    {/* Colonne Gauche: Infos Perso */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper variant="outlined" sx={{ p: 2, borderRadius: "16px", height: "100%", bgcolor: "background.default", border: "1px solid", borderColor: "divider" }}>
                            <SectionHeader title="Informations Personnelles" icon={<PersonIcon />} />
                            <Grid container spacing={1}>
                                <Grid size={12}>
                                    <DataItem label="Email" value={registration.email} icon={<EmailIcon sx={{ fontSize: 12 }} />} />
                                </Grid>
                                <Grid size={12}>
                                    <DataItem label="Téléphone" value={registration.phone} icon={<PhoneIcon sx={{ fontSize: 12 }} />} />
                                </Grid>
                                <Grid size={12}>
                                    <DataItem label="ID Parrain" value={registration.sponsor_id} icon={<BadgeIcon sx={{ fontSize: 12 }} />} />
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    {/* Colonne Droite: Adresse & Sub */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Stack spacing={3}>
                            <Paper variant="outlined" sx={{ p: 2, borderRadius: "16px", bgcolor: "background.default", border: "1px solid", borderColor: "divider" }}>
                                <SectionHeader title="Localisation" icon={<HomeIcon />} />
                                <Grid container spacing={1}>
                                    <Grid size={12}>
                                        <DataItem label="Adresse" value={registration.address} />
                                    </Grid>
                                    <Grid size={6}>
                                        <DataItem label="Ville" value={registration.city} />
                                    </Grid>
                                    <Grid size={6}>
                                        <DataItem label="Pays" value={registration.country} />
                                    </Grid>
                                </Grid>
                            </Paper>

                            <Paper variant="outlined" sx={{ p: 2, borderRadius: "16px", bgcolor: "background.default", border: "1px solid", borderColor: "divider" }}>
                                <SectionHeader title="Souscription" icon={<PlanIcon />} />
                                <Grid container spacing={1}>
                                    <Grid size={6}>
                                        <DataItem label="Méthode de Paiement" value={registration.payment_method.replace("_", " ")} />
                                    </Grid>
                                    <Grid size={6}>
                                        <DataItem label="Date" value={new Date(registration.created_at).toLocaleDateString("fr-FR")} />
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Stack>
                    </Grid>
                </Grid>
            </DialogContent>

            <Divider />

            <DialogActions sx={{ p: 3, bgcolor: "background.default" }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    sx={{ borderRadius: "12px", px: 4, fontWeight: "bold" }}
                >
                    Fermer
                </Button>
            </DialogActions>
        </Dialog>
    );
}
