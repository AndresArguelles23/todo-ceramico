"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Stack,
  TextField,
  Button,
  Alert,
  Typography,
} from "@mui/material";
import AppLayout from "@/components/layout/AppLayout";
import { supabaseBrowser } from "@/lib/supabase/client";

const schema = z.object({
  email: z.string().trim().min(1, "El correo es obligatorio").email("Correo inválido"),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const supabase = supabaseBrowser();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async ({ email }: FormData) => {
    setErrorMsg(null);
    setOkMsg(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,

    });

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    setOkMsg("Te enviamos un enlace para restablecer tu contraseña. Revisa tu correo.");
    reset({ email });
  };

  return (
    <AppLayout title="Recuperar contraseña" navItems={[]}>
      <Box sx={{ display: "grid", placeItems: "center", minHeight: "60vh" }}>
        <Card variant="outlined" sx={{ width: "100%", maxWidth: 480 }}>
          <CardHeader
            title="Recuperar contraseña"
            subheader="Te enviaremos un enlace al correo"
          />
          <CardContent>
            <Stack component="form" spacing={2} onSubmit={handleSubmit(onSubmit)} noValidate>
              {errorMsg ? <Alert severity="error">{errorMsg}</Alert> : null}
              {okMsg ? <Alert severity="success">{okMsg}</Alert> : null}

              <TextField
                label="Correo"
                type="email"
                autoComplete="email"
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
                fullWidth
              />

              <Button type="submit" variant="contained" disabled={isSubmitting}>
                Enviar enlace
              </Button>

              <Typography variant="body2" textAlign="center">
                ¿Ya la recordaste? <a href="/login">Inicia sesión</a>
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </AppLayout>
  );
}
