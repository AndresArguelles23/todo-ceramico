"use client";

import * as React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { Box, CssBaseline, ThemeProvider, createTheme, Toolbar } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ListAltIcon from "@mui/icons-material/ListAlt";

export type NavItem = {
  label: string;
  href?: string;
  icon?: React.ReactNode;
};

type AppLayoutProps = {
  title?: string;
  children: React.ReactNode;
  navItems?: NavItem[];
  initialMode?: "light" | "dark";
};

const defaultNav: NavItem[] = [
  { label: "Inicio", href: "/", icon: <HomeIcon /> },
  { label: "Panel", href: "/dashboard", icon: <DashboardIcon /> },
  { label: "Tareas", href: "/tasks", icon: <ListAltIcon /> },
];

export default function AppLayout({
  children,
  title,
  navItems = defaultNav,
  initialMode = "light",
}: AppLayoutProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [mode, setMode] = React.useState<"light" | "dark">(initialMode);

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: { mode },
        shape: { borderRadius: 12 },
        typography: {
          fontFamily:
            `"InterVariable", system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, "Helvetica Neue", Arial, "Apple Color Emoji","Segoe UI Emoji"`,
        },
      }),
    [mode]
  );

  const toggleMode = () => setMode((m) => (m === "light" ? "dark" : "light"));
  const handleDrawerToggle = () => setMobileOpen((o) => !o);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Header
        title={title}
        mode={mode}
        onToggleMode={toggleMode}
        onMenuClick={handleDrawerToggle}
      />

      <Box sx={{ display: "flex", minHeight: "100dvh", bgcolor: "background.default" }}>
        {/* Drawer móvil superpuesto */}
        <Sidebar navItems={navItems} variant="temporary" open={mobileOpen} onClose={handleDrawerToggle} />

        {/* Drawer permanente (desktop) */}
        <Sidebar navItems={navItems} variant="permanent" open />

        {/* Main ocupa el resto. En desktop se compensa el ancho del drawer */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Compensa la altura del AppBar fijo */}
          <Toolbar />
          <Box component="section" sx={{ px: { xs: 2, sm: 3 }, py: 2 }}>
            {children}
          </Box>
          <Footer />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
