"use client";

import { Box, Typography, Button, Stack } from "@mui/material";
import Link from "next/link";

const NoInvitation = () => (
  <Box
    sx={{
      minHeight: "60vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      p: 3,
    }}
  >
    <Stack spacing={3} alignItems="center" maxWidth={480} textAlign="center">
      <Typography variant="h4" fontWeight={600}>
        Registro por invitación
      </Typography>
      <Typography variant="body1" color="text.secondary">
        El registro en esta tienda requiere una invitación del administrador. Si estás interesado en
        ser cliente, envíanos tus datos a través de nuestro formulario de contacto.
      </Typography>
      <Stack direction="row" spacing={2}>
        <Button variant="contained" component={Link} href="/contact">
          Contáctanos
        </Button>
        <Button variant="outlined" component={Link} href="/auth/login">
          Ya tengo cuenta
        </Button>
      </Stack>
    </Stack>
  </Box>
);

export default NoInvitation;
