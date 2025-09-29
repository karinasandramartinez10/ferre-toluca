import { Stack, Typography, Chip, Tooltip, useMediaQuery } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { toCapitalizeFirstLetter } from "../../../../utils/cases";

export const ProductAttributes = ({ subCategory, model, type, design }) => {
  const items = [
    { label: "Subcategoría", value: subCategory },
    { label: "Tipo", value: type },
    { label: "Modelo", value: model },
    { label: "Propiedades", value: design },
  ].filter((i) => i.value);

  if (items.length === 0) return null;

  const renderLabel = (label, value) => (
    <span>
      <Typography
        component="span"
        variant="caption1"
        color="text.secondary"
        sx={{ mr: 0.5, fontSize: "14px" }}
      >
        {label}:
      </Typography>
      <Typography
        component="span"
        variant="body2"
        sx={{ fontWeight: 600, fontSize: "14px" }}
      >
        {toCapitalizeFirstLetter(value)}
      </Typography>
    </span>
  );

  const AttributeChip = ({ label, value }) => {
    const theme = useTheme();
    const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));
    const chipRef = useRef(null);
    const [isTruncated, setIsTruncated] = useState(false);

    useEffect(() => {
      const checkTruncation = () => {
        const chipEl = chipRef.current;
        if (!chipEl) return;
        const labelEl = chipEl.querySelector(".MuiChip-label");
        if (!labelEl) return;
        setIsTruncated(labelEl.scrollWidth > labelEl.clientWidth);
      };

      checkTruncation();
      window.addEventListener("resize", checkTruncation);
      return () => window.removeEventListener("resize", checkTruncation);
    }, []);

    const tooltipDisabled = !isLgUp || !isTruncated;

    const labelNode = (
      <span>
        <Typography
          component="span"
          variant="caption1"
          color="text.secondary"
          sx={{ mr: 0.5, fontSize: "14px" }}
        >
          {label}:
        </Typography>
        <Tooltip
          title={toCapitalizeFirstLetter(value)}
          arrow
          disableHoverListener={tooltipDisabled}
          disableFocusListener={tooltipDisabled}
          disableTouchListener
        >
          <Typography
            component="span"
            variant="body2"
            sx={{ fontWeight: 600, fontSize: "14px" }}
          >
            {toCapitalizeFirstLetter(value)}
          </Typography>
        </Tooltip>
      </span>
    );

    return (
      <Chip
        ref={chipRef}
        size="small"
        variant="outlined"
        label={labelNode}
        sx={{
          bgcolor: "grey.light",
          borderColor: "grey.light",
          padding: { xs: "2px 4px", lg: "16px 8px" },
          // height: { xs: "auto", lg: "28px" },
          alignItems: { xs: "flex-start", lg: "center" },
          "&:hover": {
            bgcolor: "grey.hover",
            borderColor: "grey.hover",
          },
          "& .MuiChip-label": {
            display: "inline-block",
            whiteSpace: { xs: "normal", md: "normal", lg: "nowrap" },
            maxWidth: { xs: "100%", md: "100%", lg: 220 },
            overflow: { xs: "visible", md: "visible", lg: "hidden" },
            textOverflow: { xs: "clip", md: "clip", lg: "ellipsis" },
            wordBreak: { xs: "break-word", md: "break-word", lg: "normal" },
          },
        }}
      />
    );
  };

  return (
    <Stack
      direction={{ xs: "column", lg: "row" }}
      spacing={{ xs: 1, lg: 1.5 }}
      useFlexGap
      flexWrap="wrap"
    >
      {items.map(({ label, value }) => (
        <AttributeChip key={label} label={label} value={value} />
      ))}
    </Stack>
  );
};
