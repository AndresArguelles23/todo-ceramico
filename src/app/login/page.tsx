"use client";

import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Stack,
  TextField,
  Button,
  Typography,
  Alert,
} from "@mui/material";
import AppLayout from "@/components/layout/AppLayout";
import { supabaseBrowser } from "@/lib/supabase/client";
import { signInSchema, type SignInForm } from "@/lib/validators/auth";

/** Componente interno que usa useSearchParams. Lo envolvemos con <Suspense/> abajo. */
function LoginForm() {
  const supabase = supabaseBrowser();
  const router = useRouter();
  const search = useSearchParams();
  const redirect = search.get("redirect") || "/";

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (values: SignInForm) => {
    setErrorMsg(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    if (error) {
      setErrorMsg(error.message);
      return;
    }
    router.push(redirect);
    router.refresh?.();
  };

  return (
    <Stack component="form" spacing={2} onSubmit={handleSubmit(onSubmit)} noValidate>
      {errorMsg ? <Alert severity="error">{errorMsg}</Alert> : null}

      <TextField
        label="Correo"
        type="email"
        autoComplete="email"
        {...register("email")}
        error={!!errors.email}
        helperText={errors.email?.message}
        fullWidth
      />

      <TextField
        label="Contraseña"
        type="password"
        autoComplete="current-password"
        {...register("password")}
        error={!!errors.password}
        helperText={errors.password?.message}
        fullWidth
      />

      <Button type="submit" variant="contained" disabled={isSubmitting}>
        Entrar
      </Button>

      <Typography variant="body2" textAlign="center">
        <a href="/forgot-password">¿Olvidaste tu contraseña?</a>
      </Typography>

      <Typography variant="body2" textAlign="center">
        ¿No tienes cuenta? <a href="/register">Regístrate</a>
      </Typography>
    </Stack>
  );
}

export default function LoginPage() {
  return (
    <AppLayout title="Iniciar sesión" navItems={[]}>
      <Box sx={{ display: "grid", placeItems: "center", minHeight: "60vh" }}>
        <Card variant="outlined" sx={{ width: "100%", maxWidth: 420 }}>
          <CardHeader title="Bienvenido" subheader="Ingresa a tu cuenta" />
          <CardContent>
            {/* Next 15 exige Suspense si usas useSearchParams en Client Components */}
            <Suspense fallback={<Typography variant="body2">Cargando…</Typography>}>
              <LoginForm />
            </Suspense>
          </CardContent>
        </Card>
      </Box>
    </AppLayout>
  );
}
