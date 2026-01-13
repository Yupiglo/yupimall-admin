"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Paper,
  InputAdornment,
  Stack,
  Alert,
  Theme,
} from "@mui/material";
import {
  Brightness4,
  Brightness7,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useColorMode } from "@/components/ThemeRegistry/ColorModeContext";

import AuthImageCover from "@/assets/AuthImageCover.svg";
import LogoBig from "@/assets/Logo/LogoBig.png";

export default function LoginPage() {
  const router = useRouter();
  const colorMode = useColorMode();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        // setError("Invalid email or password");
        // setIsLoading(false);
        router.push("/dashboard");
      } else {
        // Successful login
        // router.refresh(); // Update session state
        router.push("/dashboard"); // Redirect to dashboard/home
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      {/* Left Side - Hero / Illustration */}
      <Grid
        size={{ xs: 0, md: 6 }}
        sx={{
          backgroundColor: (t: Theme) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          position: "relative",
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: 4,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: "background.default",
            opacity: 0.1,
            zIndex: 1,
          }}
        />
        <Stack
          spacing={4}
          sx={{
            zIndex: 2,
            alignItems: "center",
            width: "100%",
            maxWidth: "100%",
            px: { md: 4, lg: 8 },
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: { md: "45vh", lg: "55vh" },
              minHeight: "350px",
            }}
          >
            <Image
              src={AuthImageCover.src}
              alt="YupiFlow Delivery Illustration"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Typography
              component="h1"
              variant="h3"
              fontWeight="bold"
              color="primary"
              gutterBottom
            >
              Streamline Your Deliveries
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Manage your orders, track your delivery, and grow your business
              with YupiFlow&apos;s all-in-one platform.
            </Typography>
          </Box>
        </Stack>
      </Grid>

      {/* Right Side - Login Form */}
      <Grid
        size={{ xs: 12, md: 6 }}
        component={Paper}
        elevation={0}
        square
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
          position: "relative",
        }}
      >
        {/* Theme Toggle */}
        <Box sx={{ position: "absolute", top: 16, right: 16 }}>
          <IconButton onClick={colorMode.toggleColorMode} color="inherit">
            {colorMode.mode === "dark" ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Box>

        <Box
          sx={{
            width: "100%",
            maxWidth: 450,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box sx={{ mb: 4 }}>
            <Image
              src={LogoBig.src}
              alt="YupiFlow Logo"
              width={150}
              height={150}
              style={{ objectFit: "contain" }}
            />
          </Box>

          <Typography
            component="h1"
            variant="h4"
            fontWeight="bold"
            gutterBottom
          >
            Welcome Back
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Sign in to continue to your dashboard
          </Typography>

          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 1, width: "100%" }}
          >
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              slotProps={{
                input: {
                  sx: { borderRadius: 3 },
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              slotProps={{
                input: {
                  sx: { borderRadius: 3 },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mt: 2, mb: 1 }}
            >
              <Box>
                {/* <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me for 30 days"
                /> */}
              </Box>
              <Link href="/recover" style={{ textDecoration: "none" }}>
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{ fontWeight: 500 }}
                >
                  Forgot password?
                </Typography>
              </Link>
            </Stack>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{ mt: 2, mb: 2, py: 1.5, borderRadius: 3 }}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>

            <Grid container justifyContent="space-between" sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Don&apos;t have an account?{" "}
              </Typography>

              <Link href="/register" style={{ textDecoration: "none" }}>
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Register
                </Typography>
              </Link>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
