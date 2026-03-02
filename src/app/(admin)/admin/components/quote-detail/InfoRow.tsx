import type { ReactNode } from "react";
import { Link, Stack, Typography } from "@mui/material";

interface InfoRowProps {
  icon: ReactNode;
  label: string;
  value: string;
  action?: () => void;
  actionLabel?: string;
}

const InfoRow = ({ icon, label, value, action, actionLabel }: InfoRowProps) => (
  <Stack direction="row" alignItems="center" gap={1} mb={1}>
    {icon}
    <Typography variant="body1">
      <strong>{label}:</strong> {value}
    </Typography>
    {action && (
      <Link component="button" onClick={action} color="primary" underline="hover" fontSize="14px">
        {actionLabel}
      </Link>
    )}
  </Stack>
);

export default InfoRow;
