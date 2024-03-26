import { createTheme } from "@mui/material";
import { breakpoints } from "./breakpoints";
import { palette } from "./palette";

const theme = createTheme(breakpoints);

export const components = {
  components: {
    MuiButton: {
      defaultProps: {
        variant: "primary",
        size: "medium",
        disableElevation: false,
      },
      styleOverrides: {
        root: {
          minWidth: 96,
          color: "#FFFFFF",
          lineHeight: 1,
          fontSize: "0.75rem",
          boxShadow: "none",
          padding: "10px 45px",
          border: "1px solid transparent",
          borderRadius: 8,
          fontWeight: 600,
          letterSpacing: "0.5px",
          cursor: "pointer",
          height: "38px",
          marginTop: "10px",
          transition: "all 0.3s ease",
        },
      },
      variants: [
        {
          props: { variant: "primary" },
          style: {
            backgroundColor: palette.palette.primary.main,
            "&:hover": {
              backgroundColor: palette.palette.primary.hover,
            },
          },
        },
        {
          props: { variant: "secondary" },
          style: {
            backgroundColor: "transparent",
            borderColor: "#fff",
            "&:hover": {
              backgroundColor: "#512da8",
            },
          },
        },
      ],
    },
  },
};
