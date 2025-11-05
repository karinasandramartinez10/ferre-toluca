"use client";

import {
  Card,
  CardHeader,
  CardContent,
  Chip,
  Typography,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Edit, Delete, Star, StarBorder } from "@mui/icons-material";

export default function FiscalCard({
  profile,
  isDefault,
  onEdit,
  onDelete,
  onSetDefault,
  disableDelete,
}) {
  const CARD_SX = {
    display: "flex",
    flexDirection: "column",
    height: 200,
    position: "relative",
    minWidth: 280,
    borderWidth: 2,
    borderColor: isDefault ? "primary.main" : "divider",
  };

  return (
    <Card variant="outlined" sx={CARD_SX}>
      <CardHeader
        title={
          <Box sx={{ pr: 14 }}>
            <Typography
              variant="h6"
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                lineHeight: 1.2,
              }}
            >
              {profile.fiscalName}
            </Typography>
          </Box>
        }
        subheader={`RFC: ${profile.rfc} · CP: ${profile.taxZipCode}`}
        subheaderTypographyProps={{
          noWrap: true,
          sx: {
            textOverflow: "ellipsis",
            overflow: "hidden",
            display: "block",
            pr: 14,
          },
        }}
        action={
          <Chip
            color={isDefault ? "secondary" : "default"}
            icon={isDefault ? <Star /> : <StarBorder />}
            label={isDefault ? "Predeterminado" : "No predeterminado"}
            size="small"
            sx={{ position: "absolute", top: 8, right: 8 }}
          />
        }
        sx={{ pb: 0 }}
      />
      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 1 }}
      >
        <Box display="flex" gap={1} mt="auto" flexWrap="wrap">
          <Tooltip
            title={
              isDefault ? "Ya es predeterminado" : "Marcar como predeterminado"
            }
            arrow
          >
            <span>
              <IconButton
                size="small"
                color="secondary"
                onClick={() => onSetDefault(profile.id)}
                disabled={isDefault}
                aria-label="marcar como predeterminado"
              >
                {isDefault ? <Star /> : <StarBorder />}
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Editar" arrow>
            <IconButton
              size="small"
              onClick={() => onEdit(profile)}
              aria-label="editar"
            >
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip
            title={
              disableDelete
                ? "No puedes eliminar el registro predeterminado. Asigna otro predeterminado primero"
                : "Eliminar"
            }
            arrow
          >
            <span>
              <IconButton
                size="small"
                color="error"
                onClick={() => onDelete(profile)}
                aria-label="eliminar"
                disabled={disableDelete}
              >
                <Delete />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
}
