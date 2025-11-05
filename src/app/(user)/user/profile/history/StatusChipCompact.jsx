import { Chip } from "@mui/material";
import { STEPS } from "../../../../../constants/quotes/status";

export const StatusChipCompact = ({ status }) => {
  const stepObj = STEPS.find((s) => s.value === status);
  const StatusIcon = stepObj?.Icon;
  const label = stepObj?.label || status;
  
  return (
    <Chip
      icon={StatusIcon ? <StatusIcon /> : undefined}
      label={label}
      size="small"
      color="primary"
    />
  );
};

export default StatusChipCompact;
