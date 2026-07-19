import { Avatar, Box, Button, Card, Divider, Stack, Tooltip, Typography } from "@mui/material";
import { CheckCircle, ChevronRight } from "@mui/icons-material";
import type { KeyboardEvent } from "react";
import { CloudinaryImage } from "../../../../components/CloudinaryImage";
import PromoCountBadge from "./PromoCountBadge";

interface DrillAction {
  label: string;
  onClick: () => void;
}

interface ScopeTileProps {
  name: string;
  label: string;
  selected: boolean;
  onSelect: () => void;
  count?: number;
  promos?: string[];
  image?: { publicId?: string; alt?: string };
  drill?: DrillAction | null;
}

const ScopeTile = ({
  name,
  count,
  label,
  selected,
  promos,
  image,
  onSelect,
  drill,
}: ScopeTileProps) => (
  <Card
    variant="outlined"
    sx={{
      borderRadius: 2,
      position: "relative",
      display: "flex",
      flexDirection: "column",
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
        p: 1.5,
        flex: 1,
        cursor: "pointer",
        transition: "background-color 0.15s ease",
        "&:hover": { bgcolor: "grey.light" },
      }}
    >
      {selected && (
        <CheckCircle color="primary" sx={{ position: "absolute", top: 6, left: 6, fontSize: 20 }} />
      )}
      <Stack
        alignItems="center"
        spacing={0.5}
        sx={{ textAlign: "center", width: "100%", minWidth: 0 }}
      >
        {image &&
          (image.publicId ? (
            <Box sx={{ height: 48, display: "flex", alignItems: "center" }}>
              <CloudinaryImage
                {...({
                  publicId: image.publicId,
                  alt: image.alt,
                  width: 64,
                  height: 48,
                  crop: "fit",
                  style: { objectFit: "contain" },
                } as any)}
              />
            </Box>
          ) : (
            <Avatar sx={{ bgcolor: "grey.light", color: "text.primary" }}>{image.alt?.[0]}</Avatar>
          ))}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={0.5}
          sx={{ maxWidth: "100%" }}
        >
          <Tooltip title={label} arrow>
            <Typography variant="body2" fontWeight={700} noWrap sx={{ minWidth: 0 }}>
              {name}
            </Typography>
          </Tooltip>
          <PromoCountBadge promos={promos} />
        </Stack>
        {count != null && (
          <Typography variant="caption" color="text.secondary">
            {count} productos
          </Typography>
        )}
      </Stack>
    </Box>
    {drill && (
      <>
        <Divider />
        <Button
          variant="text"
          size="small"
          fullWidth
          endIcon={<ChevronRight />}
          onClick={drill.onClick}
          sx={{
            height: "auto",
            minWidth: 0,
            py: 0.75,
            borderRadius: 0,
            textTransform: "none",
            fontWeight: 600,
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

export default ScopeTile;
