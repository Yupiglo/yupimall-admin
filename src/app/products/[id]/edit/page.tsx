"use client";

import { use, useState, useEffect, useContext } from "react";
import { CurrencyContext } from "@/helpers/currency/CurrencyContext";
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
  Grid,
  MenuItem,
  InputAdornment,
  Autocomplete,
} from "@mui/material";
import {
  ArrowBack as BackIcon,
  Save as SaveIcon,
  Inventory as ProductIcon,
  AttachMoney as PriceIcon,
  AddPhotoAlternate as AddPhotoIcon,
  Delete as DeleteIcon,
  Category as CategoryIcon,
  AddCircle as AddCircleIcon,
  CloudUpload as UploadIcon,
  AutoAwesome as BenefitsIcon,
  Science as IngredientsIcon,
  MenuBook as UsageIcon,
  LocalHospital as ClinicalIcon,
} from "@mui/icons-material";
import axiosInstance from "@/lib/axios";
import { CircularProgress } from "@mui/material";
import { getImagePath } from "@/helpers/utils/image.utils";


interface Category {
  _id: string;
  name: string;
}

interface Subcategory {
  id: string;
  _id?: string;
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
  iso_code: string;
}

export default function ProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(false);
  const { currencies, selectedCurr } = useContext(CurrencyContext);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    subcategory: "",
    brand: "",
    price: "",
    quantity: "",
    type: "",
    description: "",
    images: [] as string[],
    variants: [] as Variant[],
    countries: [] as string[], // IDs of countries
    benefits: [] as string[],
    ingredients: [] as string[],
    howToUse: "",
    clinicalResearch: "",
    reviewsData: [] as any[],
    inputCurrency: "USD",
    pv: "",
    discountPercentage: "",
  });

  const [newImages, setNewImages] = useState<File[]>([]);

  useEffect(() => {
    fetchData();
    fetchCategories();
    fetchCountries();
  }, [id]);

  useEffect(() => {
    if (formData.category) {
      fetchSubcategories(formData.category);
    }
  }, [formData.category]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`products/${id}`);
      const data = res.data.getSpecificProduct || res.data.product;
      if (data) {
        setFormData({
          title: data.title || "",
          category: data.categoryId || data.category || "",
          subcategory: data.subcategoryId || data.subcategory || "",
          brand: data.brand || "",
          price: String((data.price || 0) * selectedCurr.value),
          quantity: String(data.quantity || ""),
          type: data.type || "",
          description: data.description || "",
          images: Array.isArray(data.images) ? data.images : [],
          variants: Array.isArray(data.variants) ? data.variants : [],
          countries: Array.isArray(data.countries) ? data.countries : ["ALL"],
          benefits: Array.isArray(data.benefits) ? data.benefits : [],
          ingredients: Array.isArray(data.ingredients) ? data.ingredients : [],
          howToUse: data.howToUse || "",
          clinicalResearch: data.clinicalResearch || "",
          reviewsData: Array.isArray(data.reviewsData) ? data.reviewsData : [],
          inputCurrency: selectedCurr.currency,
          pv: String(data.pv || ""),
          discountPercentage: String(data.discountPercentage || ""),
        });
      }
    } catch (err) {
      console.error("Failed to fetch product:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("categories");
      const cats = response.data.getAllCategories || response.data.categories || response.data || [];
      setCategories(Array.isArray(cats) ? cats : []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
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
      const response = await axiosInstance.get("countries");
      setCountries(response.data.countries || []);
    } catch (error) {
      console.error("Failed to fetch countries:", error);
    }
  };

  const handleSave = async () => {
    try {
      setSubmitting(true);
      const inputRate = currencies.find(c => c.currency === formData.inputCurrency)?.value || 1;
      const priceInUsd = parseFloat(formData.price) / inputRate;

      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("price", String(priceInUsd));
      data.append("quantity", formData.quantity);
      data.append("pv", formData.pv);
      data.append("discountPercentage", formData.discountPercentage);
      data.append("category", formData.category);
      data.append("subcategory", formData.subcategory);
      data.append("brand", formData.brand);
      data.append("type", formData.type);
      data.append("variants", JSON.stringify(formData.variants));
      data.append("countries", JSON.stringify(formData.countries));
      data.append("benefits", JSON.stringify(formData.benefits));
      data.append("ingredients", JSON.stringify(formData.ingredients));
      data.append("howToUse", formData.howToUse);
      data.append("clinicalResearch", formData.clinicalResearch);
      data.append("existingImages", JSON.stringify(formData.images));

      newImages.forEach((file) => {
        data.append("images[]", file);
      });

      // Special method spoofing for Laravel PUT with files if needed, but axios usually handles it
      // or use POST with _method = PUT if PUT fails with multipart
      await axiosInstance.post(`products/${id}?_method=PUT`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      router.push(`/products`);
    } catch (err) {
      console.error("Failed to save product:", err);
      alert("Erreur lors de la sauvegarde.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddVariant = () => {
    setFormData({
      ...formData,
      variants: [...formData.variants, { key: "", value: "" }],
    });
  };

  const handleUpdateVariant = (index: number, key: string, value: string) => {
    const updated = [...formData.variants];
    updated[index] = { key, value };
    setFormData({ ...formData, variants: updated });
  };

  const handleRemoveVariant = (index: number) => {
    setFormData({
      ...formData,
      variants: formData.variants.filter((_, i) => i !== index),
    });
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImages([...newImages, ...Array.from(e.target.files)]);
    }
  };

  const handleRemoveExistingImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const handleRemoveNewImage = (index: number) => {
    setNewImages(newImages.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <IconButton
          onClick={() => router.push(`/products`)}
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
            Edit Product
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Modify product information, images, variants and stock.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
          onClick={handleSave}
          disabled={submitting}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: "bold",
            px: 4,
            boxShadow: "none",
          }}
        >
          {submitting ? "Saving..." : "Save Changes"}
        </Button>
      </Stack>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Stack spacing={4}>
            {/* General Info */}
            <Card
              elevation={0}
              sx={{
                borderRadius: "20px",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                  <ProductIcon color="primary" />
                  <Typography variant="h6" fontWeight="bold">General Information</Typography>
                </Stack>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Product Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                  />
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        select
                        fullWidth
                        label="Category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value, subcategory: "" })}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                      >
                        {categories.map((cat) => (
                          <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        select
                        fullWidth
                        label="Subcategory"
                        value={formData.subcategory}
                        disabled={!formData.category || loadingSubs}
                        onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                      >
                        {subcategories.map((sub) => (
                          <MenuItem key={sub.id || sub._id} value={sub.id || sub._id}>{sub.name}</MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        select
                        fullWidth
                        label="Product Type"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                      >
                        <MenuItem value="simple">Simple Product</MenuItem>
                        <MenuItem value="variable">Variable Product (Couleur/Taille)</MenuItem>
                        <MenuItem value="digital">Digital Product</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Brand"
                        value={formData.brand}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                      />
                    </Grid>
                  </Grid>
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                  />
                </Stack>
              </CardContent>
            </Card>

            {/* Availability */}
            <Card
              elevation={0}
              sx={{
                borderRadius: "20px",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold">Availability & Countries</Typography>
                </Stack>
                <TextField
                  select
                  fullWidth
                  label="Available in"
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
                  <MenuItem value="ALL">All Countries</MenuItem>
                  {countries.map((c) => (
                    <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                  ))}
                </TextField>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                  Selected: {formData.countries.includes("ALL") ? "All Countries" : countries.filter(c => formData.countries.includes(c.id)).map(c => c.name).join(", ")}
                </Typography>
              </CardContent>
            </Card>

            {/* Variants */}
            <Card
              elevation={0}
              sx={{
                borderRadius: "20px",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <CategoryIcon color="primary" />
                    <Typography variant="h6" fontWeight="bold">Variants & Characteristics</Typography>
                  </Stack>
                  <Button
                    startIcon={<AddCircleIcon />}
                    onClick={handleAddVariant}
                    size="small"
                    sx={{ textTransform: "none" }}
                  >
                    Add Variant
                  </Button>
                </Stack>
                <Stack spacing={2}>
                  {formData.variants.map((variant, index) => (
                    <Stack key={index} direction="row" spacing={2} alignItems="center">
                      <Autocomplete
                        freeSolo
                        sx={{ flex: 1 }}
                        options={COMMON_VARIANT_TYPES}
                        value={variant.key}
                        onInputChange={(_, newValue) => handleUpdateVariant(index, newValue, variant.value)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            label="Type (ex: Couleur)"
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                          />
                        )}
                      />
                      <Autocomplete
                        freeSolo
                        sx={{ flex: 1 }}
                        options={COMMON_VARIANT_VALUES[variant.key] || []}
                        value={variant.value}
                        onInputChange={(_, newValue) => handleUpdateVariant(index, variant.key, newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            label="Value (ex: Rouge)"
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                          />
                        )}
                      />
                      <IconButton onClick={() => handleRemoveVariant(index)} color="error" size="small">
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  ))}
                  {formData.variants.length === 0 && (
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
                      No variants added yet.
                    </Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>

            {/* Marketing Content */}
            <Card elevation={0} sx={{ borderRadius: "20px", border: "1px solid", borderColor: "divider" }}>
              <CardContent sx={{ p: 4 }}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                  <BenefitsIcon color="primary" />
                  <Typography variant="h6" fontWeight="bold">Marketing Content</Typography>
                </Stack>
                <Stack spacing={4}>
                  {/* Benefits */}
                  <Box>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                      <Typography variant="subtitle2" fontWeight="bold">Bénéfices du Produit</Typography>
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
                      <Typography variant="subtitle2" fontWeight="bold">Ingrédients</Typography>
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

                  {/* How To Use */}
                  <TextField
                    fullWidth
                    label="Comment utiliser"
                    multiline
                    rows={3}
                    value={formData.howToUse}
                    onChange={(e) => setFormData({ ...formData, howToUse: e.target.value })}
                    placeholder="Conseils d'utilisation, fréquence, etc."
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <UsageIcon color="action" fontSize="small" sx={{ mr: 1 }} />
                        </InputAdornment>
                      ),
                    }}
                  />

                  {/* Clinical Research */}
                  <TextField
                    fullWidth
                    label="Recherche Clinique / Études"
                    multiline
                    rows={3}
                    value={formData.clinicalResearch}
                    onChange={(e) => setFormData({ ...formData, clinicalResearch: e.target.value })}
                    placeholder="Résultats d'études, preuves scientifiques..."
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <ClinicalIcon color="action" fontSize="small" sx={{ mr: 1 }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Stack spacing={4}>
            {/* Pricing & Inventory */}
            <Card
              elevation={0}
              sx={{
                borderRadius: "20px",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                  <PriceIcon color="primary" />
                  <Typography variant="h6" fontWeight="bold">Pricing & Inventory</Typography>
                </Stack>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Unit Price (USD)"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <TextField
                            select
                            variant="standard"
                            value={formData.inputCurrency}
                            onChange={(e) => {
                              const newCurrency = e.target.value;
                              const oldRate = currencies.find(c => c.currency === formData.inputCurrency)?.value || 1;
                              const newRate = currencies.find(c => c.currency === newCurrency)?.value || 1;
                              const currentPrice = parseFloat(formData.price) || 0;
                              // Convert: (Current / OldRate) * NewRate
                              const newPrice = (currentPrice / oldRate) * newRate;

                              setFormData({
                                ...formData,
                                inputCurrency: newCurrency,
                                price: newPrice % 1 !== 0 ? newPrice.toFixed(2) : String(newPrice)
                              });
                            }}
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
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                  />
                  <TextField
                    fullWidth
                    label="Stock Level"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                  />
                  <TextField
                    fullWidth
                    label="Points Volume (PV)"
                    type="number"
                    value={formData.pv}
                    onChange={(e) => setFormData({ ...formData, pv: e.target.value })}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                  />
                  <TextField
                    fullWidth
                    label="Discount (%)"
                    type="number"
                    value={formData.discountPercentage}
                    onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                  />
                </Stack>
              </CardContent>
            </Card>

            {/* Images */}
            <Card
              elevation={0}
              sx={{
                borderRadius: "20px",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <AddPhotoIcon color="primary" />
                    <Typography variant="h6" fontWeight="bold">Product Photos</Typography>
                  </Stack>
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<UploadIcon />}
                    size="small"
                    sx={{ textTransform: "none", borderRadius: "8px" }}
                  >
                    Upload
                    <input type="file" hidden multiple onChange={handleImageFileChange} accept="image/*" />
                  </Button>
                </Stack>

                <Typography variant="subtitle2" sx={{ mb: 1 }}>Existing Images</Typography>
                <Grid container spacing={1} sx={{ mb: 3 }}>
                  {formData.images.map((img, idx) => (
                    <Grid key={idx} size={{ xs: 4 }}>
                      <Box sx={{ position: "relative", pt: "100%", borderRadius: "8px", overflow: "hidden", border: "1px solid", borderColor: "divider" }}>
                        <img
                          src={getImagePath(img)}
                          alt="product"
                          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveExistingImage(idx)}
                          sx={{ position: "absolute", top: 2, right: 2, bgcolor: "rgba(0,0,0,0.5)", color: "white", "&:hover": { bgcolor: "rgba(0,0,0,0.7)" } }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                <Typography variant="subtitle2" sx={{ mb: 1 }}>New Images to Upload</Typography>
                <Grid container spacing={1}>
                  {newImages.map((file, idx) => (
                    <Grid key={idx} size={{ xs: 4 }}>
                      <Box sx={{ position: "relative", pt: "100%", borderRadius: "8px", overflow: "hidden", border: "2px dashed", borderColor: "primary.main" }}>
                        <img
                          src={URL.createObjectURL(file)}
                          alt="new"
                          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveNewImage(idx)}
                          sx={{ position: "absolute", top: 2, right: 2, bgcolor: "rgba(0,0,0,0.5)", color: "white", "&:hover": { bgcolor: "rgba(0,0,0,0.7)" } }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
