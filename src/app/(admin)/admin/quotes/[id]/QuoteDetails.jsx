import {
  CalendarToday,
  Email,
  Message,
  Person,
  Phone,
  Print,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Stack,
} from "@mui/material";
import { useState, useEffect } from "react";
import { STEPS } from "../../../../../constants/quotes/status";
import { formatDateDayAbrev } from "../../../../../utils/date";
import { EditableStatusStepper } from "./EditableStatusStepper";
import InfoRow from "./InfoRow";

const QuoteDetails = ({
  quote,
  justSavedIdx,
  onCall,
  onEmail,
  onSave,
  onPrint,
}) => {
  const [selected, setSelected] = useState(quote.status);
  const [activeIdx, setActiveIdx] = useState(
    STEPS.findIndex((s) => s.value === quote.status)
  );
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const idx = STEPS.findIndex((s) => s.value === quote.status);
    setSelected(quote.status);
    setActiveIdx(idx >= 0 ? idx : 0);
    setShowAlert(false);
  }, [quote.status]);

  const handleStepClick = (idx) => {
    if (idx === activeIdx) {
      setShowAlert(true);
    } else {
      setShowAlert(false);
      setActiveIdx(idx);
      setSelected(STEPS[idx].value);
    }
  };

  const headerAction = (
    <Box>
      {!showAlert && selected !== quote.status && (
        <Button
          size="small"
          variant="contained"
          onClick={() => onSave(selected)}
        >
          Guardar estado
        </Button>
      )}
      <IconButton onClick={onPrint}>
        <Print color="primary" />
      </IconButton>
    </Box>
  );

  const infoConfig = [
    {
      icon: <Person />,
      label: "Cliente",
      value: `${quote.User.firstName} ${quote.User.lastName}`,
    },
    {
      icon: <Email />,
      label: "Email",
      value: quote.User.email,
      action: onEmail,
      actionLabel: "Enviar correo",
    },
    {
      icon: <Phone />,
      label: "Teléfono",
      value: quote.User.phoneNumber,
      action: onCall,
      actionLabel: "Llamar",
    },
    {
      icon: <CalendarToday />,
      label: "Fecha",
      value: formatDateDayAbrev(quote.createdAt),
    },
    {
      icon: <Message />,
      label: "Mensaje",
      value: quote.message || "Sin mensaje",
    },
  ];

  return (
    <Card variant="outlined" sx={{ p: 2 }}>
      <CardHeader
        title={`Seguimiento de la cotización ${quote.orderNumber}`}
        action={headerAction}
        sx={{ pb: 0, mb: 3 }}
      />
      <CardContent sx={{ pt: 0, pb: 2 }}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <EditableStatusStepper
              activeStep={activeIdx}
              justSavedIdx={justSavedIdx}
              onStepClick={handleStepClick}
            />
            {showAlert && (
              <Alert severity="info">
                Haz clic en otro paso para habilitar “Guardar estado”
              </Alert>
            )}
          </Grid>

          {/* 1. Columna izquierda: datos */}
          <Grid item xs={12} md={8}>
            <Stack spacing={1}>
              {infoConfig.map(({ icon, label, value, action, actionLabel }) => (
                <InfoRow
                  key={label}
                  icon={icon}
                  label={label}
                  value={value}
                  action={action}
                  actionLabel={actionLabel}
                />
              ))}
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default QuoteDetails;
