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
  Alert,
} from "@mui/material";
import AppLayout from "@/components/layout/AppLayout";
import { supabaseBrowser } from "@/lib/supabase/client";
import { changePasswordSchema, type ChangePasswordForm } from "@/lib/validators/auth";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
  const supabase = supabaseBrowser();
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (values: ChangePasswordForm) => {
    setErrorMsg(null);
    setOkMsg(null);

    const { error } = await supabase.auth.updateUser({
      password: values.new_password,
    });

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    setOkMsg("Contraseña actualizada correctamente.");
    reset({ new_password: "" });
    // Regresa al perfil tras un pequeño respiro visual
    setTimeout(() => router.push("/profile"), 800);
  };

  return (
    <AppLayout title="Cambiar contraseña" navItems={[]}>
      <Box sx={{ display: "grid", placeItems: "center", minHeight: "60vh" }}>
        <Card variant="outlined" sx={{ width: "100%", maxWidth: 420 }}>
          <CardHeader title="Cambiar contraseña" />
          <CardContent>
            <Stack component="form" spacing={2} onSubmit={handleSubmit(onSubmit)} noValidate>
              {errorMsg ? <Alert severity="error">{errorMsg}</Alert> : null}
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

              <Button type="submit" variant="contained" disabled={isSubmitting}>
                Actualizar
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </AppLayout>
  );
}
