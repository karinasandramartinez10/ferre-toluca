import { Stepper, Step, StepLabel } from "@mui/material";
import { STEPS } from "../../../../../constants/quotes/status";
import { motion } from "framer-motion";

const transitionAnim = { type: "spring", stiffness: 200 };
const hoverAnim = { scale: 1.1, color: "#920A0A" };

export function EditableStatusStepper({
  activeStep,
  justSavedIdx,
  onStepClick,
}) {
  return (
    <Stepper alternativeLabel activeStep={activeStep}>
      {STEPS.map(({ label, Icon }, idx) => (
        <Step key={label} completed={idx < activeStep}>
          <motion.div
            role="button"
            tabIndex={0}
            whileHover={hoverAnim}
            transition={transitionAnim}
            onClick={() => onStepClick(idx)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onStepClick(idx);
              }
            }}
            // animación al guardar
            animate={idx === justSavedIdx ? { scale: [1, 1.3] } : {}}
          >
            <StepLabel
              StepIconComponent={() => (
                <Icon
                  sx={{
                    fontSize: { xs: "1.9rem", md: "1.8rem", lg: "2rem" },
                    color: idx === activeStep ? "secondary.main" : "grey.400",
                  }}
                />
              )}
              sx={{
                cursor: "pointer",
                "&:hover": { cursor: "pointer" },
                "& .MuiStepLabel-label": {
                  typography: "body3",
                  mt: 1,
                  color: idx === activeStep ? "secondary.hover" : "grey.400",
                },
                "& .MuiStepLabel-label.MuiStepLabel-label-alternativeLabel": {
                  marginTop: 0,
                },
              }}
            >
              {label}
            </StepLabel>
          </motion.div>
        </Step>
      ))}
    </Stepper>
  );
}

