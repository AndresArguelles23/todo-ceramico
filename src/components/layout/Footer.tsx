"use client";

import * as React from "react";
import { Box, Typography } from "@mui/material";

type Props = {
  left?: React.ReactNode;
  right?: React.ReactNode;
  compact?: boolean;
};

export default function Footer({ left, right, compact = false }: Props) {
  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        borderTop: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          px: { xs: 2, sm: 3 },
          py: compact ? 1 : 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {left ?? "Hecho con MUI"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {right ?? "Construido por desarrolladores con cafeína responsable"}
        </Typography>
      </Box>
    </Box>
  );
}
