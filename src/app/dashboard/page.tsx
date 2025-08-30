import AppLayout from "@/components/layout/AppLayout";
import LogoutButton from "@/components/auth/LogoutButton";
import { supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Typography,
} from "@mui/material";

export default async function DashboardPage() {
  // Sesión vía SSR. Si no hay, a /login (el middleware ya lo hace, esto es doble airbag).
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <AppLayout title="Dashboard" navItems={[]}>
      <Stack spacing={2}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Bienvenido
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" href="/products">Productos</Button>
            <Button variant="outlined" href="/orders">Pedidos</Button>
            <LogoutButton variant="outlined" />
          </Stack>
        </Box>

        <Card variant="outlined">
          <CardHeader title="Tu sesión" />
          <CardContent>
            <Typography variant="body1">
              Estás autenticado como <strong>{user.email}</strong>.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Si llegaste aquí, el middleware y la sesión están haciendo su trabajo.
            </Typography>
          </CardContent>
        </Card>
      </Stack>
    </AppLayout>
  );
}
