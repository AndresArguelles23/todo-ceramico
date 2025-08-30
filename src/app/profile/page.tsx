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
  Avatar,
  Typography,
  Divider,
} from "@mui/material";
import AppLayout from "@/components/layout/AppLayout";
import { supabaseBrowser } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import LogoutButton from "@/components/auth/LogoutButton";

const schema = z.object({
  full_name: z.string().trim().min(1, "El nombre es obligatorio"),
  avatar_url: z
    .string()
    .url("URL inválida")
    .optional()
    .or(z.literal("")),
});

type FormData = z.infer<typeof schema>;

export default function ProfilePage() {
  const router = useRouter();
  const supabase = supabaseBrowser();

  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { full_name: "", avatar_url: "" },
  });

  // Cargar usuario y perfil
  useEffect(() => {
    let mounted = true;
    (async () => {
      setErrorMsg(null);
      setOkMsg(null);
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }
      if (!user) {
        // middleware ya debería bloquear, pero por si acaso:
        router.push("/login");
        return;
      }
      setEmail(user.email ?? "");

      const { data: profile, error: pError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!mounted) return;

      if (pError && pError.code !== "PGRST116") {
        // PGRST116 = no rows
        setErrorMsg(pError.message);
      } else {
        reset({
          full_name: profile?.full_name ?? "",
          avatar_url: profile?.avatar_url ?? "",
        });
      }
      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [reset, router, supabase]);

  const onSubmit = async (values: FormData) => {
    setErrorMsg(null);
    setOkMsg(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: values.full_name,
        avatar_url: values.avatar_url || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      setErrorMsg(error.message);
      return;
    }
    setOkMsg("Perfil actualizado");
  };

  const avatarUrl = watch("avatar_url")?.trim() || undefined;

  return (
    <AppLayout title="Perfil" navItems={[]}>
      <Box sx={{ maxWidth: 720 }}>
        <Card variant="outlined">
          <CardHeader title="Tu perfil" subheader="Actualiza tu información básica" />
          <CardContent>
            <Stack spacing={2}>
              {errorMsg ? <Alert severity="error">{errorMsg}</Alert> : null}
              {okMsg ? <Alert severity="success">{okMsg}</Alert> : null}

              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  src={avatarUrl}
                  sx={{ width: 64, height: 64 }}
                  alt={avatarUrl ? "Avatar" : "Sin avatar"}
                />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Sesión iniciada como
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {email || (loading ? "Cargando..." : "Desconocido")}
                  </Typography>
                </Box>
              </Stack>

              <Divider />

              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit(onSubmit)}
                sx={{ display: "grid", gap: 2 }}
              >
                <TextField
                  label="Nombre completo"
                  {...register("full_name")}
                  error={!!errors.full_name}
                  helperText={errors.full_name?.message}
                  fullWidth
                />

                <TextField
                  label="Avatar URL (opcional)"
                  placeholder="https://…"
                  {...register("avatar_url")}
                  error={!!errors.avatar_url}
                  helperText={errors.avatar_url?.message}
                  fullWidth
                />

                <Stack direction="row" spacing={1}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting || loading}
                  >
                    Guardar cambios
                  </Button>
                  <Button
                    type="button"
                    variant="outlined"
                    href="/profile/change-password"
                  >
                    Cambiar contraseña
                  </Button>
                  <LogoutButton variant="outlined" />
                </Stack>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </AppLayout>
  );
}
