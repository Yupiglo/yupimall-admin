"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Paper,
  Stack,
  Alert,
  Theme,
} from "@mui/material";
import { Brightness4, Brightness7, ArrowBack } from "@mui/icons-material";
import { useColorMode } from "@/components/ThemeRegistry/ColorModeContext";

import AuthImageCover from "@/assets/AuthImageCover.svg";
import LogoBig from "@/assets/Logo/LogoBig.png";

export default function RecoverPage() {
  const router = useRouter();
  const colorMode = useColorMode();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!email) {
      setError("Please enter your email address");
      setIsLoading(false);
      return;
    }

    try {
      // Mocking recovery process
      console.log("Password recovery for:", email);
      setTimeout(() => {
        setIsLoading(false);
        setIsSubmitted(true);
      }, 1500);
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
              Recover Access
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Don&apos;t worry, it happens to the best of us. We&apos;ll help
              you get back in no time.
            </Typography>
          </Box>
        </Stack>
      </Grid>

      {/* Right Side - Recovery Form */}
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
              width={120}
              height={120}
              style={{ objectFit: "contain" }}
            />
          </Box>

          <Typography
            component="h1"
            variant="h4"
            fontWeight="bold"
            gutterBottom
          >
            Forgot Password?
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4, textAlign: "center" }}
          >
            {isSubmitted
              ? "Check your email for instructions to reset your password"
              : "Enter your email address and we'll send you a link to reset your password"}
          </Typography>

          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 1, width: "100%" }}
          >
            {isSubmitted ? (
              <Alert severity="success" sx={{ mb: 3, borderRadius: 3 }}>
                Recovery email sent successfully!
              </Alert>
            ) : (
              <>
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

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  sx={{
                    mt: 3,
                    mb: 2,
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: "bold",
                  }}
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
              </>
            )}

            <Grid container justifyContent="center" sx={{ mt: 2 }}>
              <Link href="/login" passHref legacyBehavior>
                <Button
                  component="a"
                  variant="text"
                  startIcon={<ArrowBack />}
                  sx={{
                    textDecoration: "none",
                    fontWeight: "bold",
                    color: "text.secondary",
                    "&:hover": {
                      color: "primary.main",
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  Back to Login
                </Button>
              </Link>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
