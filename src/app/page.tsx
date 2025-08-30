"use client";

import "@fontsource-variable/inter";
import AppLayout from "@/components/layout/AppLayout";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Divider,
  TextField,
  InputAdornment,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Stack,
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const PESO = (n: number) =>
  n.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

export default function Page() {
  // Mock data (reemplazar con API cuando esté lista)
  const kpis = [
    { label: "Ventas hoy", value: PESO(1245000), icon: <TrendingUpIcon /> },
    { label: "Pedidos hoy", value: 18, icon: <ShoppingCartIcon /> },
    { label: "Ticket promedio", value: PESO(69167), icon: <DashboardIcon /> },
    { label: "Stock crítico", value: 7, icon: <WarningAmberIcon /> },
  ];

  const recientes = [
    { id: "PED-1042", cliente: "Constructora A", total: PESO(280000), estado: "Pendiente" },
    { id: "PED-1041", cliente: "Obra Calle 9", total: PESO(720000), estado: "Enviado" },
    { id: "PED-1040", cliente: "María P.", total: PESO(195000), estado: "Entregado" },
    { id: "PED-1039", cliente: "Arquitecto Z", total: PESO(510000), estado: "Pendiente" },
  ];

  const bajos = [
    { sku: "CER-001", nombre: "Baldosa 60x60 Gris", stock: 3 },
    { sku: "CER-014", nombre: "Baldosa 30x30 Arena", stock: 5 },
    { sku: "PEG-002", nombre: "Pegante porcelanato 20kg", stock: 2 },
  ];

  return (
    <AppLayout
      title="Inicio"
      navItems={[
        { label: "Inicio", href: "/", icon: <HomeIcon /> },
        { label: "Productos", href: "/products", icon: <Inventory2Icon /> },
        { label: "Pedidos", href: "/orders", icon: <ShoppingCartIcon /> },
        { label: "Dashboard", href: "/dashboard", icon: <DashboardIcon /> },
      ]}
      initialMode="light"
    >
      {/* Encabezado + búsqueda + acciones rápidas */}
      <Box sx={{ display: "grid", gap: 2, mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Bienvenido
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="contained" startIcon={<AddIcon />} href="/products">
              Nuevo producto
            </Button>
            <Button variant="outlined" startIcon={<ShoppingCartIcon />} href="/orders">
              Registrar pedido
            </Button>
          </Stack>
        </Box>

        <TextField
          placeholder="Buscar productos, pedidos o clientes…"
          fullWidth
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* KPIs */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" },
          gap: 2,
          mb: 2,
        }}
      >
        {kpis.map((kpi) => (
          <Card key={kpi.label} variant="outlined">
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {kpi.icon}
                <Typography variant="body2" color="text.secondary">
                  {kpi.label}
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ mt: 0.5, fontWeight: 700 }}>
                {kpi.value}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Dos columnas: pedidos recientes / stock bajo */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "2.2fr 1fr" },
          gap: 2,
        }}
      >
        {/* Recientes */}
        <Card variant="outlined">
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ px: 2, py: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
              <LocalShippingIcon />
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Últimos pedidos
              </Typography>
              <Box sx={{ ml: "auto" }}>
                <Button size="small" href="/orders">Ver todos</Button>
              </Box>
            </Box>
            <Divider />
            <Box sx={{ p: { xs: 1, sm: 2 } }}>
              <Table size="small" aria-label="Pedidos recientes">
                <TableHead>
                  <TableRow>
                    <TableCell>Pedido</TableCell>
                    <TableCell>Cliente</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell>Estado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recientes.map((r) => (
                    <TableRow key={r.id} hover>
                      <TableCell>{r.id}</TableCell>
                      <TableCell>{r.cliente}</TableCell>
                      <TableCell align="right">{r.total}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={r.estado}
                          color={
                            r.estado === "Entregado"
                              ? "success"
                              : r.estado === "Enviado"
                              ? "info"
                              : "warning"
                          }
                          variant="outlined"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </CardContent>
        </Card>

        {/* Stock bajo */}
        <Card variant="outlined">
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ px: 2, py: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
              <WarningAmberIcon />
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Stock bajo
              </Typography>
              <Box sx={{ ml: "auto" }}>
                <Button size="small" href="/products">Ver productos</Button>
              </Box>
            </Box>
            <Divider />
            <Box sx={{ p: { xs: 1, sm: 2 }, display: "grid", gap: 1 }}>
              {bajos.map((b) => (
                <Box
                  key={b.sku}
                  sx={{
                    p: 1,
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 1.5,
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: 1,
                  }}
                >
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {b.nombre}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      SKU: {b.sku}
                    </Typography>
                  </Box>
                  <Chip
                    size="small"
                    label={`${b.stock} unid.`}
                    color={b.stock <= 3 ? "error" : "warning"}
                    variant="outlined"
                  />
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </AppLayout>
  );
}
