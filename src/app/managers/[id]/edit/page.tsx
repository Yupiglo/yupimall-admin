"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  IconButton,
  Button,
  TextField,
  MenuItem,
  Divider,
  Grid,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  ArrowBack as BackIcon,
  Save as SaveIcon,
  Security as SecurityIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import axiosInstance from "@/lib/axios";

interface PermissionRow {
  module: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

const initialPermissions: PermissionRow[] = [
  { module: "Products", view: true, create: false, edit: false, delete: false },
  { module: "Orders", view: true, create: true, edit: false, delete: false },
  { module: "Entries", view: true, create: false, edit: false, delete: false },
  { module: "Exits", view: true, create: false, edit: false, delete: false },
  { module: "Deliveries", view: true, create: true, edit: true, delete: false },
  { module: "Couriers", view: true, create: false, edit: false, delete: false },
  {
    module: "Customers",
    view: true,
    create: false,
    edit: false,
    delete: false,
  },
];

export default function ManagerEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const decodedId = decodeURIComponent(id);

  const [formData, setFormData] = useState({
    nom: "",
    prenoms: "",
    sexe: "",
    email: "",
    phone: "",
    role: "",
    status: "",
  });

  const [permissions, setPermissions] =
    useState<PermissionRow[]>(initialPermissions);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchManager = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get(`users/${decodedId}`);
        if (response.data.message === 'success') {
          const userData = response.data.user;
          const nameParts = (userData.name || '').split(' ');
          setFormData({
            nom: nameParts.length > 1 ? nameParts.slice(-1)[0] : nameParts[0] || "",
            prenoms: nameParts.length > 1 ? nameParts.slice(0, -1).join(' ') : "",
            sexe: userData.sexe || "Masculin",
            email: userData.email || "",
            phone: userData.phone || "",
            role: userData.role || "Admin",
            status: userData.status || "Active",
          });
        }
      } catch (err) {
        console.error("Error fetching manager:", err);
        setError("Failed to load manager data");
      } finally {
        setLoading(false);
      }
    };

    if (decodedId) {
      fetchManager();
    }
  }, [decodedId]);

  const handleToggle = (
    moduleIndex: number,
    action: keyof Omit<PermissionRow, "module">
  ) => {
    const newPermissions = [...permissions];
    newPermissions[moduleIndex] = {
      ...newPermissions[moduleIndex],
      [action]: !newPermissions[moduleIndex][action],
    };
    setPermissions(newPermissions);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      const fullName = formData.prenoms 
        ? `${formData.prenoms} ${formData.nom}`.trim()
        : formData.nom;
      await axiosInstance.put(`users/${decodedId}`, {
        name: fullName,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        status: formData.status,
        sexe: formData.sexe,
      });
      router.push(`/managers/${decodedId}`);
    } catch (err) {
      console.error("Error saving manager:", err);
      setError("Failed to save manager changes");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !formData.email) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => router.push("/managers")}>
          Back to Managers
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <IconButton
          onClick={() => router.push(`/managers/${id}`)}
          sx={{
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: "12px",
          }}
        >
          <BackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" fontWeight="bold" color="primary.main">
            Edit Manager
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Modify personal details and modular access levels.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
          onClick={handleSave}
          disabled={saving}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: "bold",
            px: 4,
            boxShadow: "none",
          }}
        >
          {saving ? "Saving..." : "Save Changes"}
        </Button>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Stack>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card
            elevation={0}
            sx={{
              borderRadius: "20px",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                sx={{ mb: 3 }}
              >
                <PersonIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Personal Information
                </Typography>
              </Stack>
              <Stack spacing={2.5}>
                <TextField
                  fullWidth
                  label="Nom"
                  value={formData.nom}
                  onChange={(e) =>
                    setFormData({ ...formData, nom: e.target.value })
                  }
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                />
                <TextField
                  fullWidth
                  label="Prénoms"
                  value={formData.prenoms}
                  onChange={(e) =>
                    setFormData({ ...formData, prenoms: e.target.value })
                  }
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                />
                <TextField
                  select
                  fullWidth
                  label="Sexe"
                  value={formData.sexe}
                  onChange={(e) =>
                    setFormData({ ...formData, sexe: e.target.value })
                  }
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                >
                  <MenuItem value="Masculin">Masculin</MenuItem>
                  <MenuItem value="Féminin">Féminin</MenuItem>
                  <MenuItem value="Autre">Autre</MenuItem>
                </TextField>
                <TextField
                  fullWidth
                  label="Email"
                  value={formData.email}
                  disabled
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                />
                <TextField
                  fullWidth
                  label="Phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 8 }}>
          <Card
            elevation={0}
            sx={{
              borderRadius: "20px",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ p: 4 }}>
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  sx={{ mb: 1 }}
                >
                  <SecurityIcon color="primary" />
                  <Typography variant="h6" fontWeight="bold">
                    Modular Permissions
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  Configure granular access for each module in the system.
                </Typography>
              </Box>

              <Divider />

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          bgcolor: "background.paper",
                          pl: 4,
                        }}
                      >
                        Module
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ fontWeight: "bold", bgcolor: "background.paper" }}
                      >
                        View
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ fontWeight: "bold", bgcolor: "background.paper" }}
                      >
                        Create
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ fontWeight: "bold", bgcolor: "background.paper" }}
                      >
                        Edit
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          fontWeight: "bold",
                          bgcolor: "background.paper",
                          pr: 4,
                        }}
                      >
                        Delete
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {permissions.map((row, index) => (
                      <TableRow key={row.module} hover>
                        <TableCell sx={{ fontWeight: "medium", pl: 4 }}>
                          {row.module}
                        </TableCell>
                        <TableCell align="center">
                          <Checkbox
                            checked={row.view}
                            onChange={() => handleToggle(index, "view")}
                            color="primary"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Checkbox
                            checked={row.create}
                            onChange={() => handleToggle(index, "create")}
                            color="primary"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Checkbox
                            checked={row.edit}
                            onChange={() => handleToggle(index, "edit")}
                            color="primary"
                          />
                        </TableCell>
                        <TableCell align="center" sx={{ pr: 4 }}>
                          <Checkbox
                            checked={row.delete}
                            onChange={() => handleToggle(index, "delete")}
                            color="error"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
