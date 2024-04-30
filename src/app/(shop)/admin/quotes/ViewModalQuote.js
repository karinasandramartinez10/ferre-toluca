import { Close } from "@mui/icons-material";
import { Box, IconButton, Modal, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";

export const ViewModalQuote = ({ open, onClose, quote }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="Quote"
      aria-describedby="quote-message"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          border: "1px solid #f67003",
          borderRadius: "8px",
          boxShadow: 24,
          p: 4,
          width: !fullScreen ? "500px" : "100%",
        }}
      >
        <Stack gap={2}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography id="quote-modal-title" variant="h4" component="h2">
              {/* {product?.name} */}asdas
            </Typography>
            <IconButton
              size="large"
              edge="start"
              aria-label="menu"
              onClick={onClose}
              color="primary"
              // sx={{ color: "#FFF"}}
            >
              <Close />
            </IconButton>
          </Box>
          <Typography id="quote-modal-description">
            Agrega un mensaje
          </Typography>
        </Stack>
      </Box>
    </Modal>
  );
};
