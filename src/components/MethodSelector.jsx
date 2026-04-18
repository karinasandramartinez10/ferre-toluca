"use client";

import { Box, Paper, Stack, Typography } from "@mui/material";

const MethodSelector = ({ options, value, onChange }) => (
  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
    {options.map((option, index) => (
      <Paper
        key={index}
        variant="outlined"
        onClick={() => onChange(index)}
        sx={{
          flex: 1,
          p: 2,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 2,
          borderWidth: 2,
          borderColor: value === index ? "primary.main" : "divider",
          bgcolor: value === index ? "primary.50" : "transparent",
          transition: "all 0.2s ease",
          "&:hover": {
            borderColor: "primary.main",
            bgcolor: "action.hover",
          },
        }}
      >
        <Box sx={{ color: value === index ? "primary.main" : "text.secondary" }}>{option.icon}</Box>
        <Box>
          <Typography variant="subtitle2" fontWeight={700}>
            {option.title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {option.description}
          </Typography>
        </Box>
      </Paper>
    ))}
  </Stack>
);

export default MethodSelector;
