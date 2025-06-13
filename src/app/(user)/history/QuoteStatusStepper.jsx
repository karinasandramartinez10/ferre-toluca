import { Stepper, Step, StepLabel, Box } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

const steps = [
  { label: "En revisión", Icon: InfoOutlinedIcon },
  { label: "Parcialmente completo", Icon: PlaylistAddCheckIcon },
  { label: "Completo", Icon: CheckCircleIcon },
  { label: "Enviado", Icon: LocalShippingIcon },
];

const statusToIndex = {
  IN_REVIEW: 0,
  PARTIALLY_AVAILABLE: 1,
  READY_FOR_DISPATCH: 2,
  DISPATCHED: 3,
};

export const QuoteStatusStepper = ({ status }) => {
  const activeStep = statusToIndex[status] ?? 0;

  return (
    <Box sx={{ width: "100%", mb: 2 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map(({ label, Icon }, idx) => (
          <Step key={label}>
            <StepLabel
              icon={
                <Icon
                  sx={{
                    fontSize: { xs: "1.9rem", md: "1.8rem", lg: "2rem" },
                    color: idx === activeStep ? "secondary.main" : "grey.400",
                  }}
                />
              }
              sx={{
                "& .MuiStepLabel-label": {
                  typography: "body3",
                  mt: 0.5,
                },
              }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};
