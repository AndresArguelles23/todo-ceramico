"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { signUpSchema, type SignUpForm } from "@/lib/validators/auth";

export default function RegisterPage() {
  const supabase = supabaseBrowser();

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (values: SignUpForm) => {
    setErrorMsg(null);
    setInfoMsg(null);

    const { email, password, full_name } = values;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/login`
      },
    });

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    // Si la confirmación por correo está activada en Supabase,
    // user.confirmed_at vendrá vacío inicialmente.
    if (data?.user && !data.user.confirmed_at) {
      setInfoMsg("Te enviamos un correo para confirmar tu cuenta. Revisa tu bandeja.");
      reset({ email, password: "", full_name });
      return;
    }

    // Si no usas confirmación por correo, ya tendrías sesión activa.
    setInfoMsg("Cuenta creada. Ya puedes iniciar sesión.");
  };

  return (
    <AppLayout title="Registrarse" navItems={[]}>
      <Box sx={{ display: "grid", placeItems: "center", minHeight: "60vh" }}>
        <Card variant="outlined" sx={{ width: "100%", maxWidth: 480 }}>
          <CardHeader title="Crear cuenta" />
          <CardContent>
            <Stack component="form" spacing={2} onSubmit={handleSubmit(onSubmit)} noValidate>
              {errorMsg ? <Alert severity="error">{errorMsg}</Alert> : null}
              {infoMsg ? <Alert severity="info">{infoMsg}</Alert> : null}

              <TextField
                label="Nombre completo"
                {...register("full_name")}
                error={!!errors.full_name}
                helperText={errors.full_name?.message}
                fullWidth
              />

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
                autoComplete="new-password"
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
                fullWidth
              />

              <Button type="submit" variant="contained" disabled={isSubmitting}>
                Registrarme
              </Button>

              <Typography variant="body2" textAlign="center">
                ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </AppLayout>
  );
}
