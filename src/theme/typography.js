import { createTheme } from "@mui/material";
import { breakpoints } from "./breakpoints";

const fontFamily = {
  sans: "'Nunito', sans-serif",
};

const fontWeight = {
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extraBold: 700,
};

const theme = createTheme(breakpoints);

export const typography = {
  typography: {
    fontFamily: fontFamily.sans,
    h1: {
      fontWeight: fontWeight.bold,
      lineHeight: 1.4,
      [theme.breakpoints.down("sm")]: {
        fontSize: "1.5rem !important",
      },
      [theme.breakpoints.down("md")]: {
        fontSize: "1.625rem",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "2rem",
      },
    },
    h2: {
      fontSize: "1.75rem",
      fontWeight: fontWeight.regular,
      lineHeight: 1.4,
      /*       [theme.breakpoints.up("lg")]: {
        fontSize: "2rem",
      }, */
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: fontWeight.extraBold,
      lineHeight: 1.4,
      // [theme.breakpoints.up("lg")]: {
      //   fontSize: "2rem",
      // },
    },
    h4: {
      fontSize: "1.375rem",
      fontWeight: fontWeight.semibold,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: fontWeight.semibold,
      lineHeight: 1.4,
      // [theme.breakpoints.up("xl")]: {
      //   fontSize: "1.625rem",
      // },
    },
    subtitle1: {
      fontSize: "1.125rem",
      fontWeight: fontWeight.regular,
      lineHeight: 1.4,
      // [theme.breakpoints.up("xl")]: {
      //   fontSize: "1.25rem",
      // },
    },
    body1: {
      fontSize: "1rem",
      fontWeight: fontWeight.regular,
      lineHeight: 1.4,
      // [theme.breakpoints.up("xl")]: {
      //   fontSize: "1.125rem",
      // },
    },
    body2: {
      fontSize: "0.938rem",
      fontWeight: fontWeight.regular,
      lineHeight: 1.4,
      // [theme.breakpoints.up("xl")]: {
      //   fontSize: "0.969rem",
      // },
    },
    body3: {
      fontSize: "0.875rem",
      fontWeight: fontWeight.regular,
      lineHeight: 1.4,
      // [theme.breakpoints.up("xl")]: {
      //   fontSize: "1rem",
      // },
    },
    caption1: {
      fontSize: "0.75rem",
      fontWeight: fontWeight.regular,
      lineHeight: 1.33,
      [theme.breakpoints.up("lg")]: {
        fontSize: "0.875rem",
      },
    },
  },
};
