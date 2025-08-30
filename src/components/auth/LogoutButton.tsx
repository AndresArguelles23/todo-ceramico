"use client";

import { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";

type Props = {
  children?: React.ReactNode; // texto del botón
  variant?: "text" | "outlined" | "contained";
  size?: "small" | "medium" | "large";
};

export default function LogoutButton({
  children = "Cerrar sesión",
  variant = "text",
  size = "medium",
}: Props) {
  const [loading, setLoading] = useState(false);
  const supabase = supabaseBrowser();
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleLogout}
      disabled={loading}
      variant={variant}
      size={size}
    >
      {loading ? <CircularProgress size={18} /> : children}
    </Button>
  );
}
