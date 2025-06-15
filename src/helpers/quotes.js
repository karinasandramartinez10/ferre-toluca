import { STEPS } from "../constants/quotes/status";

export const statusLabelMap = STEPS.reduce(
  (acc, { value, label }) => ({ ...acc, [value]: label }),
  {}
);
