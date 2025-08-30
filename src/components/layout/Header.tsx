"use client";

import * as React from "react";
import {
  AppBar,
  IconButton,
  Slide,
  Toolbar,
  Tooltip,
  Typography,
  useScrollTrigger,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import UserMenu from "@/components/auth/UserMenu";

type Props = {
  title?: string;
  mode: "light" | "dark";
  onToggleMode: () => void;
  onMenuClick?: () => void; // abre el drawer en móvil
};

function HideOnScroll({ children }: { children: React.ReactElement }) {
  const trigger = useScrollTrigger({ threshold: 64 });
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export default function Header({
  title = "Aplicación",
  mode,
  onToggleMode,
  onMenuClick,
}: Props) {
  return (
    <HideOnScroll>
      <AppBar
        position="fixed"
        color="default"
        elevation={0}
        sx={(theme) => ({
          bgcolor: "background.paper",
          borderBottom: 1,
          borderColor: "divider",
          zIndex: theme.zIndex.drawer + 1,
          left: 0,
          width: "100%",
        })}
      >
        <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
          {onMenuClick ? (
            <IconButton
              aria-label="Abrir menú"
              edge="start"
              onClick={onMenuClick}
              sx={{ mr: 1, display: { md: "none" } }}
            >
              <MenuIcon />
            </IconButton>
          ) : null}

          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            {title}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Tooltip title={mode === "dark" ? "Usar tema claro" : "Usar tema oscuro"}>
              <IconButton aria-label="Cambiar tema" onClick={onToggleMode}>
                {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>

            {/* Menú de usuario: login/register si no hay sesión, avatar si hay sesión */}
            <UserMenu />
          </Box>
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  );
}
