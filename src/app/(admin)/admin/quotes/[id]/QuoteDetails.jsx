import {
  CalendarToday,
  Email,
  Message,
  Person,
  Phone,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { STEPS } from "../../../../../constants/quotes/status";
import { formatDateDayAbrev } from "../../../../../utils/date";
import { EditableStatusStepper } from "./EditableStatusStepper";
import InfoRow from "./InfoRow";

const QuoteDetails = ({ quote, justSavedIdx, onCall, onEmail, onSave }) => {
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
    </Box>
  );

  const infoConfig = [
    {
      icon: <Person />,
      label: "Cliente",
      value: `${quote.User.firstName} ${quote.User.lastName}`,
    },
    { icon: <Email />, label: "Email", value: quote.User.email },
    { icon: <Phone />, label: "Teléfono", value: quote.User.phoneNumber },
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
              {infoConfig.map(({ icon, label, value }) => (
                <InfoRow key={label} icon={icon} label={label} value={value} />
              ))}
            </Stack>
          </Grid>
          {/* 2. Columna derecha: botones alineados verticalmente */}
          <Grid item xs={12} md={4}>
            <Stack
              spacing={1}
              justifyContent="center"
              alignItems={{ xs: "center", md: "flex-start" }}
              sx={{ height: "100%" }}
            >
              {/* En mobile: row + gap, en md+: column */}
              <Box
                component="div"
                sx={{
                  display: "flex",
                  flexDirection: { xs: "row", md: "column" },
                  gap: 1,
                  width: "100%",
                  justifyContent: "center", // centra en xs
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h5"
                  textAlign={{ xs: "center", md: "left" }}
                >
                  ¿Quieres contactar al cliente?
                </Typography>

                <Button startIcon={<Phone />} onClick={onCall} size="small">
                  Llamar
                </Button>
                <Button startIcon={<Email />} onClick={onEmail} size="small">
                  Correo
                </Button>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default QuoteDetails;
