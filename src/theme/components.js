import { palette } from "./palette";

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
          color: "#FFF",
          lineHeight: 1,
          fontSize: "0.75rem",
          boxShadow: "none",
          padding: "10px 45px",
          backgroundColor: palette.palette.primary.main,
          borderRadius: 8,
          fontWeight: 600,
          letterSpacing: "0.5px",
          cursor: "pointer",
          height: "38px",
          marginTop: "10px",
          transition: "all 0.3s ease",
          "&:hover": {
            backgroundColor: palette.palette.primary.hover,
          },
          "&:disabled": {
            backgroundColor: palette.palette.primary.disabled,
            color: "#FFF",
          },
        },
      },
      variants: [
        {
          props: { variant: "primary" },
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
    MuiTextField: {
      defaultProps: {
        size: "small",
        InputProps: {
          sx: {
            borderRadius: "8px",
            backgroundColor: "#FFF",
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
        },
      },
    },
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
        position: "fixed",
      },
      styleOverrides: {
        root: {
          backgroundColor: palette.palette.primary.light,
          height: 64,
          /*           
          [theme.breakpoints.up("lg")]: {
            height: 70,
          }, */
        },
      },
    },
  },
};
