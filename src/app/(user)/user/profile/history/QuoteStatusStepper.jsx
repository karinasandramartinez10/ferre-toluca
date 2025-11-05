import { Stepper, Step, StepLabel, Box } from "@mui/material";
import { STEPS } from "../../../../../constants/quotes/status";

export const QuoteStatusStepper = ({ status }) => {
  const activeIndex = STEPS.findIndex((step) => step.value === status);
  const idx0 = activeIndex >= 0 ? activeIndex : 0;

  return (
    <Box sx={{ width: "100%", mb: 2, mt: 2 }}>
      <Stepper activeStep={activeIndex} alternativeLabel>
        {STEPS.map(({ label, Icon }, idx) => (
          <Step key={label} completed={idx < idx0}>
            <StepLabel
              icon={
                <Icon
                  sx={{
                    fontSize: { xs: "1.9rem", md: "1.8rem", lg: "2rem" },
                    color: idx === idx0 ? "secondary.main" : "grey.400",
                  }}
                />
              }
              sx={{
                "& .MuiStepLabel-label": {
                  fontSize: "0.875rem",
                  mt: 0,
                  color: idx === idx0 ? "secondary.hover" : "grey.400",
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
