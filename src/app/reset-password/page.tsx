"use client";

import { useEffect, useState } from "react";
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
import { useRouter } from "next/navigation";

const schema = z
  .object({
    new_password: z.string().min(8, "Mínimo 8 caracteres"),
    confirm_password: z.string().min(8, "Mínimo 8 caracteres"),
  })
  .refine((v) => v.new_password === v.confirm_password, {
    path: ["confirm_password"],
    message: "Las contraseñas no coinciden",
  });

type FormData = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const supabase = supabaseBrowser();
  const router = useRouter();

  const [exchangeDone, setExchangeDone] = useState(false);
  const [exchangeError, setExchangeError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  // Al llegar desde el correo, intercambiamos el "code" por una sesión temporal
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          const currentUrl = new URL(window.location.href);
          const code = currentUrl.searchParams.get("code");

          // Algunas versiones de supabase-js exponen exchangeCodeForSession; otras no.
          const authEx = supabase.auth as unknown as {
            exchangeCodeForSession?: (value: string) => Promise<void>;
          };

          if (authEx.exchangeCodeForSession) {
            if (code) {
              await authEx.exchangeCodeForSession(code);
            } else {
              // Fallback: hay providers que ponen los tokens en la URL completa
              await authEx.exchangeCodeForSession(window.location.href);
            }
          }
        }
        if (!mounted) return;
        setExchangeDone(true);
      } catch (err: unknown) {
        if (!mounted) return;
        const message =
          err instanceof Error
            ? err.message
            : "No se pudo validar el enlace de recuperación.";
        setExchangeError(message);
        setExchangeDone(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [supabase]);

  const onSubmit = async (values: FormData) => {
    setOkMsg(null);
    const { error } = await supabase.auth.updateUser({ password: values.new_password });
    if (error) {
      return alert(error.message);
    }
    setOkMsg("Contraseña actualizada correctamente.");
    reset({ new_password: "", confirm_password: "" });
    setTimeout(() => router.push("/login"), 800);
  };

  return (
    <AppLayout title="Restablecer contraseña" navItems={[]}>
      <Box sx={{ display: "grid", placeItems: "center", minHeight: "60vh" }}>
        <Card variant="outlined" sx={{ width: "100%", maxWidth: 480 }}>
          <CardHeader
            title="Restablecer contraseña"
            subheader="Define tu nueva contraseña"
          />
          <CardContent>
            {!exchangeDone ? (
              <Alert severity="info">Validando enlace…</Alert>
            ) : exchangeError ? (
              <Stack spacing={2}>
                <Alert severity="error">{exchangeError}</Alert>
                <Typography variant="body2" color="text.secondary">
                  Intenta solicitar un nuevo enlace desde{" "}
                  <a href="/forgot-password">Recuperar contraseña</a>.
                </Typography>
              </Stack>
            ) : (
              <Stack component="form" spacing={2} onSubmit={handleSubmit(onSubmit)} noValidate>
                {okMsg ? <Alert severity="success">{okMsg}</Alert> : null}

                <TextField
                  label="Nueva contraseña"
                  type="password"
                  autoComplete="new-password"
                  {...register("new_password")}
                  error={!!errors.new_password}
                  helperText={errors.new_password?.message}
                  fullWidth
                />

                <TextField
                  label="Confirmar contraseña"
                  type="password"
                  autoComplete="new-password"
                  {...register("confirm_password")}
                  error={!!errors.confirm_password}
                  helperText={errors.confirm_password?.message}
                  fullWidth
                />

                <Button type="submit" variant="contained" disabled={isSubmitting}>
                  Guardar contraseña
                </Button>

                <Typography variant="body2" textAlign="center">
                  ¿Recordaste tu acceso? <a href="/login">Inicia sesión</a>
                </Typography>
              </Stack>
            )}
          </CardContent>
        </Card>
      </Box>
    </AppLayout>
  );
}
