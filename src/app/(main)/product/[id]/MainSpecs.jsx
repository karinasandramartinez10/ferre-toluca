import { Box, List, ListItem, Stack, Typography } from "@mui/material";

export const MainSpecs = ({ color, measureValue, measure }) => {
  if (!color && !measureValue) return null;

  return (
    <Box mt={4}>
      <Typography variant="h5" gutterBottom>
        Especificaciones principales
      </Typography>
      <Box sx={{ borderBottom: "2px solid #e53935", width: "80px", mb: 2 }} />
      <Stack>
        <List>
          {color && (
            <ListItem
              disableGutters
              disablePadding
              sx={{ fontSize: "14px", gap: 0.5 }}
            >
              <Typography variant="body2" fontWeight={600}>
                Color:
              </Typography>
              <Typography variant="body2">{color}</Typography>
            </ListItem>
          )}
          {measureValue && (
            <ListItem
              disableGutters
              disablePadding
              sx={{ fontSize: "14px", gap: 0.5 }}
            >
              <Typography variant="body2" fontWeight={600}>
                Medida:
              </Typography>
              <Typography variant="body2">
                {measureValue}
                {measure}
              </Typography>
            </ListItem>
          )}
        </List>
      </Stack>
    </Box>
  );
};
