"use client";

import type { ReactNode } from "react";
import { Box, Chip, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { ChevronRight } from "@mui/icons-material";
import { motion } from "framer-motion";

export interface FunnelStep {
  key: string;
  label: string;
  icon: ReactNode;
  count: number | null;
  countLabel?: string;
}

interface CustomerFunnelHeaderProps {
  steps: FunnelStep[];
  activeKey: string;
  onSelect: (key: string) => void;
}

const CountBadge = ({ count, active }: { count: number | null; active: boolean }) => {
  const theme = useTheme();
  if (count == null) return null;
  return (
    <motion.span
      key={count}
      initial={{ scale: 1.3 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      style={{ display: "inline-flex" }}
    >
      <Chip
        label={count}
        size="small"
        sx={{
          height: 20,
          minWidth: 28,
          fontWeight: 700,
          bgcolor: active ? "secondary.main" : alpha(theme.palette.common.white, 0.14),
          color: active ? "secondary.contrastText" : alpha(theme.palette.common.white, 0.85),
        }}
      />
    </motion.span>
  );
};

export function CustomerFunnelHeader({ steps, activeKey, onSelect }: CustomerFunnelHeaderProps) {
  const theme = useTheme();
  const mutedText = alpha(theme.palette.common.white, 0.6);
  const mutedIcon = alpha(theme.palette.common.white, 0.45);

  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        p: 1,
        borderRadius: 2,
        bgcolor: "primary.main",
        overflowX: "auto",
      }}
    >
      {steps.map((step, idx) => {
        const active = step.key === activeKey;
        return (
          <Box key={step.key} sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            <motion.div
              role="tab"
              aria-selected={active}
              tabIndex={0}
              whileHover={{ scale: 1.04 }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={() => onSelect(step.key)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(step.key);
                }
              }}
              style={{ cursor: "pointer", outline: "none" }}
            >
              <Box
                sx={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  px: 2,
                  py: 1,
                  color: active ? "common.white" : mutedText,
                }}
              >
                <Box sx={{ display: "flex", color: active ? "secondary.main" : mutedIcon }}>
                  {step.icon}
                </Box>
                <Stack spacing={0}>
                  <Typography variant="subtitle2" fontWeight={active ? 700 : 600} noWrap>
                    {step.label}
                  </Typography>
                  {step.countLabel && step.count != null && (
                    <Typography variant="caption" sx={{ color: mutedText }} noWrap>
                      {step.countLabel}
                    </Typography>
                  )}
                </Stack>
                <CountBadge count={step.count} active={active} />

                {active && (
                  <motion.div
                    layoutId="funnel-active-underline"
                    style={{
                      position: "absolute",
                      left: 8,
                      right: 8,
                      bottom: 0,
                      height: 3,
                      borderRadius: 3,
                      background: theme.palette.secondary.main,
                    }}
                  />
                )}
              </Box>
            </motion.div>

            {idx < steps.length - 1 && (
              <ChevronRight sx={{ color: mutedIcon, mx: 0.5, flexShrink: 0 }} />
            )}
          </Box>
        );
      })}
    </Stack>
  );
}

export default CustomerFunnelHeader;
