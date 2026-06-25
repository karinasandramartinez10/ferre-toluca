import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { Edit, Delete } from "@mui/icons-material";
import { Box, Chip, Typography } from "@mui/material";
import { formatShortDate } from "../../../../utils/date";
import {
  PROMOTION_STATUS_COLORS,
  PROMOTION_STATUS_LABELS,
  PROMOTION_TYPE_LABELS,
  SCOPE_KIND_LABELS,
  getPromotionScope,
} from "../../../../constants/promotions";
import type { Promotion, PromotionScopeType } from "../../../../types/promotion";

interface ColumnHandlers {
  getScopeLabel: (kind: PromotionScopeType, id: number) => string;
  onEdit: (row: Promotion) => void;
  onDelete: (row: Promotion) => void;
}

export const getPromotionColumns = ({
  getScopeLabel,
  onEdit,
  onDelete,
}: ColumnHandlers): GridColDef[] => [
  { field: "name", headerName: "Nombre de la promoción", width: 200 },
  {
    field: "type",
    headerName: "Tipo",
    width: 130,
    renderCell: ({ value }) => (
      <Chip label={PROMOTION_TYPE_LABELS[value] || value} size="small" variant="outlined" />
    ),
  },
  {
    field: "discountPercentage",
    headerName: "Porcentaje de descuento",
    width: 150,
    renderCell: ({ value }) => <Chip label={`${value ?? "0"}%`} size="small" variant="outlined" />,
  },
  {
    field: "scope",
    headerName: "Ámbito",
    width: 240,
    sortable: false,
    renderCell: ({ row }) => {
      const scope = getPromotionScope(row);
      const scopeKind = scope.kind as PromotionScopeType;
      return (
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="caption" color="text.secondary" display="block">
            {SCOPE_KIND_LABELS[scopeKind]}
          </Typography>
          <Typography variant="body2" noWrap>
            {getScopeLabel(scopeKind, scope.id)}
          </Typography>
        </Box>
      );
    },
  },
  {
    field: "vigencia",
    headerName: "Vigencia",
    width: 190,
    sortable: false,
    renderCell: ({ row }) => `${formatShortDate(row.startsAt)} – ${formatShortDate(row.endsAt)}`,
  },
  {
    field: "status",
    headerName: "Estado",
    width: 130,
    renderCell: ({ value }) => (
      <Chip
        label={PROMOTION_STATUS_LABELS[value] || value}
        size="small"
        color={PROMOTION_STATUS_COLORS[value] || "default"}
      />
    ),
  },
  {
    field: "actions",
    type: "actions",
    headerName: "Acciones",
    width: 110,
    getActions: ({ row }) => [
      <GridActionsCellItem
        key={`edit-${row.id}`}
        icon={<Edit />}
        label="Editar"
        onClick={() => onEdit(row)}
      />,
      <GridActionsCellItem
        key={`delete-${row.id}`}
        icon={<Delete />}
        label="Borrar"
        color="error"
        onClick={() => onDelete(row)}
      />,
    ],
  },
];
