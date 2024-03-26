import { createTheme } from "@mui/material/styles";
import deepmerge from "deepmerge";
import { breakpoints } from "./breakpoints";
import { palette } from "./palette";
import { components } from "./components";
import { typography } from "./typography";

export const mainTheme = createTheme(
  deepmerge.all([components, breakpoints, palette, typography])
);
