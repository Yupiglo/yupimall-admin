"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  IconButton,
  InputAdornment,
  MenuItem,
  Autocomplete,
  Stack,
} from "@mui/material";
import {
  Close as CloseIcon,
  CloudUpload as UploadIcon,
  AttachMoney as MoneyIcon,
  Inventory as InventoryIcon,
  SquareFoot as BoxIcon,
  NotificationsActive as ThresholdIcon,
  Category as CategoryIcon,
  AccountTree as SubcategoryIcon,
  AddCircle as AddCircleIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useState, useEffect, useContext } from "react";
import axiosInstance from "@/lib/axios";
import { CurrencyContext } from "@/helpers/currency/CurrencyContext";

interface Category {
  _id: string | number;
  id?: string | number;
  name: string;
}

interface Subcategory {
  _id: string | number;
  id?: string | number;
  name: string;
}

interface Variant {
  key: string;
  value: string;
}

const COMMON_VARIANT_TYPES = [
  "Couleur",
  "Taille",
  "Matière",
  "Pointure",
  "Poids",
  "Format",
  "Stockage",
  "RAM",
];

const COMMON_VARIANT_VALUES: { [key: string]: string[] } = {
  "Couleur": ["Rouge", "Bleu", "Vert", "Noir", "Blanc", "Gris", "Jaune", "Rose", "Orange", "Violet"],
  "Taille": ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
  "Matière": ["Coton", "Cuir", "Soie", "Polyester", "Laine", "Lin", "Acier", "Bois"],
  "Format": ["Petit", "Moyen", "Grand", "A4", "A5", "Numérique"],
};

interface Country {
  id: string;
  name: string;
}

type AddProductModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function AddProductModal({
  open,
  onClose,
}: AddProductModalProps) {
  const [formData, setFormData] = useState({
    label: "",
    description: "",
    image: "",
    quantity: "",
    quantityPerBox: "",
    unitPrice: "",
    threshold: "",
    category: "",
    subcategory: "",
    countries: ["ALL"] as string[],
    variants: [] as Variant[],
    benefits: [] as string[],
    ingredients: [] as string[],
    howToUse: "",
    clinicalResearch: "",
    inputCurrency: "USD",
    pv: "",
    discountPercentage: "",
  });

  const { currencies, selectedCurr } = useContext(CurrencyContext);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loadingCats, setLoadingCats] = useState(false);
  const [loadingSubs, setLoadingSubs] = useState(false);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      fetchCategories();
      fetchCountries();
      // Set default input currency to selected system currency
      setFormData(prev => ({ ...prev, inputCurrency: selectedCurr.currency }));
    }
  }, [open, selectedCurr.currency]);

  useEffect(() => {
    if (formData.category) {
      fetchSubcategories(formData.category);
    } else {
      setSubcategories([]);
      setFormData(prev => ({ ...prev, subcategory: "" }));
    }
  }, [formData.category]);

  const fetchCategories = async () => {
    try {
      setLoadingCats(true);
      const response = await axiosInstance.get("categories");
      const cats = response.data.getAllCategories || response.data.categories || response.data || [];
      setCategories(Array.isArray(cats) ? cats : []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoadingCats(false);
    }
  };

  const fetchSubcategories = async (categoryId: string) => {
    try {
      setLoadingSubs(true);
      const response = await axiosInstance.get(`categories/${categoryId}/subcategories`);
      const subs = response.data.getAllSubCategories || response.data.subcategories || response.data || [];
      setSubcategories(Array.isArray(subs) ? subs : []);
    } catch (error) {
      console.error("Failed to fetch subcategories:", error);
    } finally {
      setLoadingSubs(false);
    }
  };

  const fetchCountries = async () => {
    try {
      setLoadingCountries(true);
      const response = await axiosInstance.get("countries");
      setCountries(response.data.countries || []);
    } catch (error) {
      console.error("Failed to fetch countries:", error);
    } finally {
      setLoadingCountries(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddVariant = () => {
    setFormData({ ...formData, variants: [...formData.variants, { key: "", value: "" }] });
  };

  const handleUpdateVariant = (index: number, key: string, value: string) => {
    const updated = [...formData.variants];
    updated[index] = { key, value };
    setFormData({ ...formData, variants: updated });
  };

  const handleRemoveVariant = (index: number) => {
    setFormData({ ...formData, variants: formData.variants.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const inputRate = currencies.find(c => c.currency === formData.inputCurrency)?.value || 1;
      const priceInUsd = parseFloat(formData.unitPrice) / inputRate;

      const payload = {
        title: formData.label,
        description: formData.description,
        price: priceInUsd,
        quantity: parseInt(formData.quantity),
        pv: formData.pv ? parseFloat(formData.pv) : 0,
        discountPercentage: formData.discountPercentage ? parseFloat(formData.discountPercentage) : 0,
        category: formData.category,
        subcategory: formData.subcategory,
        countries: formData.countries,
        variants: JSON.stringify(formData.variants),
        benefits: JSON.stringify(formData.benefits),
        ingredients: JSON.stringify(formData.ingredients),
        howToUse: formData.howToUse,
        clinicalResearch: formData.clinicalResearch,
      };

      await axiosInstance.post("products", payload);
      onClose();
      setFormData({
        label: "",
        description: "",
        image: "",
        quantity: "",
        quantityPerBox: "",
        unitPrice: "",
        threshold: "",
        category: "",
        subcategory: "",
        countries: ["ALL"],
        variants: [],
        benefits: [],
        ingredients: [],
        howToUse: "",
        clinicalResearch: "",
        inputCurrency: "USD",
        pv: "",
        discountPercentage: "",
      });
    } catch (error) {
      console.error("Failed to add product:", error);
      alert("Erreur lors de l'ajout du produit");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          backgroundImage: "none",
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 3,
          fontWeight: "bold",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Ajouter un Produit
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ color: "text.secondary" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: 4, pt: 1 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <TextField
                name="label"
                label="Libellé du Produit"
                fullWidth
                required
                value={formData.label}
                onChange={handleChange}
                placeholder="Ex: Veste en Cuir Premium"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                name="description"
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Caractéristiques, matériaux, etc."
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                name="category"
                label="Catégorie"
                fullWidth
                required
                value={formData.category}
                onChange={handleChange}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CategoryIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              >
                {loadingCats ? (
                  <MenuItem disabled>Chargement...</MenuItem>
                ) : (
                  categories.map((cat) => (
                    <MenuItem key={cat._id || cat.id} value={cat._id || cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))
                )}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                name="subcategory"
                label="Sous-catégorie"
                fullWidth
                disabled={!formData.category || loadingSubs}
                value={formData.subcategory}
                onChange={handleChange}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SubcategoryIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              >
                {loadingSubs ? (
                  <MenuItem disabled>Chargement...</MenuItem>
                ) : subcategories.length === 0 ? (
                  <MenuItem disabled>Aucune sous-catégorie</MenuItem>
                ) : (
                  subcategories.map((sub) => (
                    <MenuItem key={sub._id || sub.id} value={sub._id || sub.id}>
                      {sub.name}
                    </MenuItem>
                  ))
                )}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="quantity"
                label="Quantité Initiale"
                type="number"
                fullWidth
                required
                value={formData.quantity}
                onChange={handleChange}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <InventoryIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="unitPrice"
                label="Prix Unitaire"
                type="number"
                fullWidth
                value={formData.unitPrice}
                onChange={handleChange}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TextField
                        select
                        variant="standard"
                        value={formData.inputCurrency}
                        onChange={(e) => setFormData({ ...formData, inputCurrency: e.target.value })}
                        InputProps={{ disableUnderline: true }}
                        sx={{ width: 80, mr: 1 }}
                      >
                        {currencies.map((c) => (
                          <MenuItem key={c.currency} value={c.currency}>
                            {c.symbol} ({c.currency})
                          </MenuItem>
                        ))}
                      </TextField>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                select
                name="countries"
                label="Disponibilité par Pays"
                fullWidth
                required
                SelectProps={{
                  multiple: true,
                  value: formData.countries,
                  renderValue: (selected: any) => {
                    if (selected.includes("ALL")) return "Tous les pays";
                    return countries
                      .filter((c) => selected.includes(c.id))
                      .map((c) => c.name)
                      .join(", ");
                  },
                  onChange: (e: any) => {
                    const value = e.target.value;
                    const newValue = typeof value === "string" ? value.split(",") : value;
                    if (newValue.length > 0 && newValue[newValue.length - 1] === "ALL") {
                      setFormData({ ...formData, countries: ["ALL"] });
                    } else {
                      const filtered = newValue.filter((v: string) => v !== "ALL");
                      setFormData({ ...formData, countries: filtered.length === 0 ? ["ALL"] : filtered });
                    }
                  }
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              >
                <MenuItem value="ALL">Tous les pays</MenuItem>
                {loadingCountries ? (
                  <MenuItem disabled>Chargement...</MenuItem>
                ) : (
                  countries.map((c) => (
                    <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                  ))
                )}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Box sx={{ mt: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Typography variant="subtitle2" fontWeight="bold">Variantes & Caractéristiques</Typography>
                  <Button size="small" startIcon={<AddCircleIcon />} onClick={handleAddVariant} sx={{ textTransform: 'none' }}>
                    Ajouter
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {formData.variants.map((v, idx) => (
                    <Box key={idx} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Autocomplete
                        freeSolo
                        sx={{ flex: 1 }}
                        options={COMMON_VARIANT_TYPES}
                        value={v.key}
                        onInputChange={(_, val) => handleUpdateVariant(idx, val, v.value)}
                        renderInput={(params) => <TextField {...params} size="small" label="Type" />}
                      />
                      <Autocomplete
                        freeSolo
                        sx={{ flex: 1 }}
                        options={COMMON_VARIANT_VALUES[v.key] || []}
                        value={v.value}
                        onInputChange={(_, val) => handleUpdateVariant(idx, v.key, val)}
                        renderInput={(params) => <TextField {...params} size="small" label="Valeur" />}
                      />
                      <IconButton size="small" color="error" onClick={() => handleRemoveVariant(idx)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                  {formData.variants.length === 0 && (
                    <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', py: 1 }}>
                      Aucune variante ajoutée.
                    </Typography>
                  )}
                </Box>
              </Box>
            </Grid>

            {/* Content Extensions */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1, mt: 1 }}>Contenu Marketing (Optionnel)</Typography>
              <Stack spacing={2}>
                <TextField
                  label="Comment utiliser"
                  fullWidth
                  multiline
                  rows={2}
                  value={formData.howToUse}
                  onChange={(e) => setFormData({ ...formData, howToUse: e.target.value })}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                />

                {/* Benefits */}
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="caption" fontWeight="bold">Bénéfices</Typography>
                    <Button size="small" startIcon={<AddCircleIcon />} onClick={() => setFormData({ ...formData, benefits: [...formData.benefits, ""] })}>
                      Ajouter
                    </Button>
                  </Stack>
                  <Stack spacing={1}>
                    {formData.benefits.map((benefit, idx) => (
                      <Stack key={idx} direction="row" spacing={1} alignItems="center">
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="ex: Hydratation intense"
                          value={benefit}
                          onChange={(e) => {
                            const updated = [...formData.benefits];
                            updated[idx] = e.target.value;
                            setFormData({ ...formData, benefits: updated });
                          }}
                        />
                        <IconButton size="small" color="error" onClick={() => {
                          setFormData({ ...formData, benefits: formData.benefits.filter((_, i) => i !== idx) });
                        }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    ))}
                    {formData.benefits.length === 0 && (
                      <Typography variant="caption" color="text.secondary">Aucun bénéfice ajouté.</Typography>
                    )}
                  </Stack>
                </Box>

                {/* Ingredients */}
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="caption" fontWeight="bold">Ingrédients</Typography>
                    <Button size="small" startIcon={<AddCircleIcon />} onClick={() => setFormData({ ...formData, ingredients: [...formData.ingredients, ""] })}>
                      Ajouter
                    </Button>
                  </Stack>
                  <Stack spacing={1}>
                    {formData.ingredients.map((ing, idx) => (
                      <Stack key={idx} direction="row" spacing={1} alignItems="center">
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="ex: Acide Hyaluronique"
                          value={ing}
                          onChange={(e) => {
                            const updated = [...formData.ingredients];
                            updated[idx] = e.target.value;
                            setFormData({ ...formData, ingredients: updated });
                          }}
                        />
                        <IconButton size="small" color="error" onClick={() => {
                          setFormData({ ...formData, ingredients: formData.ingredients.filter((_, i) => i !== idx) });
                        }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    ))}
                    {formData.ingredients.length === 0 && (
                      <Typography variant="caption" color="text.secondary">Aucun ingrédient ajouté.</Typography>
                    )}
                  </Stack>
                </Box>

                <TextField
                  label="Recherche Clinique"
                  fullWidth
                  multiline
                  rows={2}
                  value={formData.clinicalResearch}
                  onChange={(e) => setFormData({ ...formData, clinicalResearch: e.target.value })}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                />
              </Stack>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={onClose} sx={{ textTransform: "none", fontWeight: "bold", color: "text.secondary" }}>
            Annuler
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={submitting}
            sx={{ borderRadius: "10px", px: 4, fontWeight: "bold", textTransform: "none", boxShadow: "none" }}
          >
            {submitting ? "En cours..." : "Ajouter le Produit"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
