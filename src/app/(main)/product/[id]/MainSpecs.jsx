import { Box, List, ListItem, Stack, Typography } from "@mui/material";

export const MainSpecs = ({
  color,
  measureValue,
  measure,
  qualifier,
  secondaryMeasureValue,
  secondaryMeasure,
}) => {
  if (!color && !measureValue && !qualifier && !secondaryMeasureValue) return null;

  return (
    <Box mt={4}>
      <Typography variant="h5" gutterBottom>
        Especificaciones principales
      </Typography>
      <Box sx={{ borderBottom: "2px solid #e53935", width: "80px", mb: 2 }} />
      <Stack>
        <List>
          {color && (
            <ListItem disableGutters disablePadding sx={{ fontSize: "14px", gap: 0.5 }}>
              <Typography variant="body2" fontWeight={600}>
                Color:
              </Typography>
              <Typography variant="body2">{color}</Typography>
            </ListItem>
          )}
          {measureValue && (
            <ListItem disableGutters disablePadding sx={{ fontSize: "14px", gap: 0.5 }}>
              <Typography variant="body2" fontWeight={600}>
                Medida:
              </Typography>
              <Typography variant="body2">
                {measureValue} {measure}
              </Typography>
            </ListItem>
          )}
          {qualifier && (
            <ListItem disableGutters disablePadding sx={{ fontSize: "14px", gap: 0.5 }}>
              <Typography variant="body2" fontWeight={600}>
                Cualificador:
              </Typography>
              <Typography variant="body2">{qualifier}</Typography>
            </ListItem>
          )}
          {secondaryMeasureValue && (
            <ListItem disableGutters disablePadding sx={{ fontSize: "14px", gap: 0.5 }}>
              <Typography variant="body2" fontWeight={600}>
                Medida secundaria:
              </Typography>
              <Typography variant="body2">
                {secondaryMeasureValue} {secondaryMeasure}
              </Typography>
            </ListItem>
          )}
        </List>
      </Stack>
    </Box>
  );
};
