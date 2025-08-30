"use client";

import * as React from "react";
import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Tooltip,
} from "@mui/material";
import Logout from "@mui/icons-material/Logout";
import Person from "@mui/icons-material/Person";
import Login from "@mui/icons-material/Login";
import AppRegistration from "@mui/icons-material/AppRegistration";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function UserMenu() {
  const router = useRouter();
  const supabase = React.useMemo(() => supabaseBrowser(), []);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [email, setEmail] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  const open = Boolean(anchorEl);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!mounted) return;
      if (error || !data.user) {
        setEmail(null);
        setLoading(false);
        return;
      }
      setEmail(data.user.email ?? null);
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [supabase]);

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const signOut = async () => {
    await supabase.auth.signOut();
    handleClose();
    router.push("/login");
    router.refresh?.();
  };

  // Si no hay sesión: mostrar accesos directos a Login/Registro
  if (!loading && !email) {
    return (
      <>
        <Tooltip title="Iniciar sesión">
          <IconButton href="/login" size="small" aria-label="Login">
            <Login />
          </IconButton>
        </Tooltip>
        <Tooltip title="Registrarse">
          <IconButton href="/register" size="small" aria-label="Register">
            <AppRegistration />
          </IconButton>
        </Tooltip>
      </>
    );
  }

  // Estado de carga o con sesión: avatar con menú
  return (
    <>
      <Tooltip title={email ?? "Cuenta"}>
        <IconButton onClick={handleOpen} size="small" aria-label="Usuario">
          <Avatar sx={{ width: 32, height: 32 }}>
            {email?.[0]?.toUpperCase() || "U"}
          </Avatar>
        </IconButton>
      </Tooltip>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={() => { handleClose(); router.push("/profile"); }}>
          <ListItemIcon><Person fontSize="small" /></ListItemIcon>
          Perfil
        </MenuItem>
        <Divider />
        <MenuItem onClick={signOut}>
          <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
          Cerrar sesión
        </MenuItem>
      </Menu>
    </>
  );
}
