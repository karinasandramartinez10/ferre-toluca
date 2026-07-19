import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import { SCOPE_KIND_LABELS } from "../../../../constants/promotions";
import type { PromotionScopeType, ScopeSelection } from "../../../../types/promotion";

interface ScopeSelectionBarProps {
  selection: ScopeSelection[];
  onRemove: (kind: PromotionScopeType, id: number) => void;
  onClear: () => void;
  onCreate: () => void;
}

const ScopeSelectionBar = ({ selection, onRemove, onClear, onCreate }: ScopeSelectionBarProps) => (
  <Stack
    direction="row"
    spacing={1}
    alignItems="center"
    sx={{
      mb: 2,
      p: 1.5,
      borderRadius: 2,
      bgcolor: "grey.light",
      position: "sticky",
      top: 0,
      zIndex: 1,
      flexWrap: "wrap",
      gap: 1,
    }}
  >
    <Typography variant="body2" fontWeight={700} sx={{ flexShrink: 0 }}>
      {selection.length} seleccionado{selection.length > 1 ? "s" : ""}
    </Typography>
    <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", flexGrow: 1, minWidth: 0 }}>
      {selection.map((s) => (
        <Chip
          key={`${s.kind}:${s.id}`}
          size="small"
          label={`${SCOPE_KIND_LABELS[s.kind]}: ${s.label}`}
          onDelete={() => onRemove(s.kind, s.id)}
        />
      ))}
    </Box>
    <Button size="small" color="inherit" onClick={onClear}>
      Limpiar
    </Button>
    <Button size="small" variant="contained" onClick={onCreate}>
      Crear promoción
    </Button>
  </Stack>
);

export default ScopeSelectionBar;
