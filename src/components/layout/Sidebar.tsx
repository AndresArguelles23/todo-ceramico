"use client";

import * as React from "react";
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

export const DRAWER_WIDTH = 280;

export type NavItem = {
  label: string;
  href?: string;
  icon?: React.ReactNode;
};

export type SidebarProps = {
  navItems: NavItem[];
  variant: "temporary" | "permanent";
  open: boolean;
  onClose?: () => void;
};

function SidebarContent({ navItems }: { navItems: NavItem[] }) {
  return (
    <Box
      role="navigation"
      aria-label="Navegación principal"
      sx={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <Divider />
      <List sx={{ py: 1 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.label}
            component="a"
            href={item.href || "#"}
            sx={{ borderRadius: 2, mx: 1, my: 0.5 }}
          >
            {item.icon ? <ListItemIcon>{item.icon}</ListItemIcon> : null}
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
      <Box sx={{ mt: "auto", p: 2 }} />
    </Box>
  );
}

export default function Sidebar({
  navItems,
  variant,
  open,
  onClose,
}: SidebarProps) {
  if (variant === "permanent") {
    // Drawer fijo que empieza DEBAJO del AppBar (56px móvil, 64px desktop)
    return (
      <Drawer
        variant="permanent"
        open
        PaperProps={{
          elevation: 0,
          sx: {
            position: "fixed",
            left: 0,
            top: { xs: 56, sm: 64 },
            height: { xs: "calc(100% - 56px)", sm: "calc(100% - 64px)" },
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            borderRight: 1,
            borderColor: "divider",
          },
        }}
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          display: { xs: "none", md: "block" },
        }}
      >
        <SidebarContent navItems={navItems} />
      </Drawer>
    );
  }

  // Drawer móvil superpuesto
  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      PaperProps={{
        elevation: 0,
        sx: { width: DRAWER_WIDTH, boxSizing: "border-box" },
      }}
      sx={{ display: { xs: "block", md: "none" } }}
    >
      <SidebarContent navItems={navItems} />
    </Drawer>
  );
}
