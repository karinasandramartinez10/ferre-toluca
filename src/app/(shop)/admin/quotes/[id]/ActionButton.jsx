import { Button } from "@mui/material";

const ActionButton = ({ label, icon, onClick }) => (
  <Button
    variant="contained"
    color="primary"
    onClick={onClick}
    startIcon={icon}
    fullWidth
  >
    {label}
  </Button>
);

export default ActionButton;
