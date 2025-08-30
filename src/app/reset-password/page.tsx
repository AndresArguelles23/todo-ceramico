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

  const [ready, setReady] = useState(false);            // ¿tenemos sesión de recuperación lista?
  const [exchangeError, setExchangeError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  // Garantiza sesión de recuperación antes de permitir cambiar la contraseña
  useEffect(() => {
    let mounted = true;

    async function ensureRecoverySession() {
      try {
        // ¿ya hay sesión?
        const sess = await supabase.auth.getSession();
        if (sess.data.session) {
          if (mounted) setReady(true);
          return;
        }

        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        const token = url.searchParams.get("token");
        const typeParam = url.searchParams.get("type");

        // 1) Ruta moderna: ?code=...
        const auth1 = supabase.auth as unknown as {
          exchangeCodeForSession?: (value: string) => Promise<void>;
        };
        if (code && auth1.exchangeCodeForSession) {
          await auth1.exchangeCodeForSession(code);
          if (mounted) setReady(true);
          return;
        }

        // 2) Ruta clásica: ?type=recovery&token=...
        if (token && (typeParam === "recovery" || !typeParam)) {
          const auth2 = supabase.auth as unknown as {
            verifyOtp: (args: { token_hash: string; type: "recovery" }) => Promise<{ data: unknown; error: Error | null }>;
          };
          const { error } = await auth2.verifyOtp({ token_hash: token, type: "recovery" });
          if (error) throw error;
          if (mounted) setReady(true);
          return;
        }

        // Si llegamos aquí, no venía ningún parámetro útil
        throw new Error("Enlace inválido o incompleto. Solicita otro desde 'Recuperar contraseña'.");
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "No se pudo validar el enlace de recuperación.";
        if (mounted) {
          setExchangeError(msg);
          setReady(false);
        }
      }
    }

    ensureRecoverySession();
    return () => {
      mounted = false;
    };
  }, [supabase]);

  const onSubmit = async (values: FormData) => {
    setOkMsg(null);

    // Seguridad extra: confirma que sí hay sesión antes de actualizar
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setExchangeError("La sesión de recuperación no está activa. Vuelve a abrir el enlace del correo.");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: values.new_password });
    if (error) {
      alert(error.message);
      return;
    }

    setOkMsg("Contraseña actualizada correctamente.");
    reset({ new_password: "", confirm_password: "" });

    // Limpieza opcional: cerrar sesión temporal y mandar al login
    setTimeout(async () => {
      await supabase.auth.signOut();
      router.push("/login");
    }, 800);
  };

  return (
    <AppLayout title="Restablecer contraseña" navItems={[]}>
      <Box sx={{ display: "grid", placeItems: "center", minHeight: "60vh" }}>
        <Card variant="outlined" sx={{ width: "100%", maxWidth: 480 }}>
          <CardHeader title="Restablecer contraseña" subheader="Define tu nueva contraseña" />
          <CardContent>
            {!ready && !exchangeError ? (
              <Alert severity="info">Validando enlace…</Alert>
            ) : exchangeError ? (
              <Stack spacing={2}>
                <Alert severity="error">{exchangeError}</Alert>
                <Typography variant="body2" color="text.secondary">
                  Solicita un nuevo enlace desde <a href="/forgot-password">Recuperar contraseña</a>.
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
