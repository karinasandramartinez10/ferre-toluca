import { STEPS } from "../constants/quotes/status";

export const statusLabelMap: Record<string, string> = STEPS.reduce(
  (acc, { value, label }) => ({ ...acc, [value]: label }),
  {} as Record<string, string>
);
