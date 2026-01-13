import { createTheme, PaletteMode } from "@mui/material/styles";
import { Figtree } from "next/font/google";

const figtree= Figtree({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const getTheme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: "#8f1cd2",
      },
      secondary: {
        main: "#0c24ff",
      },
      tertio: {
        main: "#ffffff",
      },
      error: {
        main: "#fd5353",
      },
      success: {
        main: "#00b230",
      },
      warning: {
        main: "#ff4a09",
      },
      ...(mode === "light"
        ? {
            background: {
              default: "#f7f9fa",
              paper: "#ffffff",
            },
            text: {
              primary: "#111827",
              secondary: "#6B7280",
              tertio: "#000000",
            },
          }
        : {
            background: {
              default: "#121212",
              paper: "#1e1e1e",
            },
            text: {
              primary: "#ffffff",
              secondary: "#bbbbbb",
              tertio: "#ffffff"
            },
          }),
    },
    typography: {
      fontFamily: figtree.style.fontFamily,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: "0.75rem",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: "1rem",
            boxShadow:
              mode === "light"
                ? "0 1px 2px 0 rgb(0 0 0 / 0.05)"
                : "0 1px 2px 0 rgb(0 0 0 / 0.3)",
            border: mode === "light" ? "1px solid #e5e5e5" : "1px solid #333",
          },
        },
      },
    },
  });

export default getTheme;
