import { Box, Button, Card, Divider, Typography } from "@mui/material";
import { CheckCircle, ChevronRight, RadioButtonUnchecked } from "@mui/icons-material";
import type { KeyboardEvent } from "react";
import PromoCountBadge from "./PromoCountBadge";

interface DrillAction {
  label: string;
  onClick: () => void;
}

interface ScopeRowProps {
  name: string;
  selected: boolean;
  onSelect: () => void;
  count?: number;
  promos?: string[];
  drill?: DrillAction | null;
}

const ScopeRow = ({ name, count, selected, promos, onSelect, drill }: ScopeRowProps) => (
  <Card
    variant="outlined"
    sx={{
      borderRadius: 2,
      display: "flex",
      alignItems: "stretch",
      borderColor: selected ? "primary.main" : "divider",
      borderWidth: selected ? 2 : 1,
    }}
  >
    <Box
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e: KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      sx={{
        flex: 1,
        minWidth: 0,
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        px: { xs: 1.5, sm: 2 },
        py: 1.25,
        cursor: "pointer",
        transition: "background-color 0.15s ease",
        "&:hover": { bgcolor: "grey.light" },
      }}
    >
      {selected ? (
        <CheckCircle color="primary" sx={{ fontSize: 20, flexShrink: 0 }} />
      ) : (
        <RadioButtonUnchecked sx={{ fontSize: 20, color: "action.disabled", flexShrink: 0 }} />
      )}
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography variant="body2" fontWeight={600}>
          {name}
        </Typography>
        {count != null && (
          <Typography variant="caption" color="text.secondary">
            {count} productos
          </Typography>
        )}
      </Box>
      <PromoCountBadge promos={promos} />
    </Box>
    {drill && (
      <>
        <Divider orientation="vertical" flexItem />
        <Button
          variant="text"
          size="small"
          onClick={drill.onClick}
          endIcon={<ChevronRight />}
          sx={{
            flexShrink: 0,
            px: { xs: 1, sm: 2 },
            borderRadius: 0,
            textTransform: "none",
            fontWeight: 600,
            whiteSpace: "nowrap",
            color: "text.secondary",
            "&:hover": { bgcolor: "grey.light", color: "primary.main" },
          }}
        >
          {drill.label}
        </Button>
      </>
    )}
  </Card>
);

export default ScopeRow;
