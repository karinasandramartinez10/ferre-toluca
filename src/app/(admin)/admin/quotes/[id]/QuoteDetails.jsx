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
} from "@mui/material";
import { useState, useEffect } from "react";
import { STEPS } from "../../../../../constants/quotes/status";
import { formatDateDayAbrev } from "../../../../../utils/date";
import ActionButton from "./ActionButton";
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

  // Al hacer click en un paso
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

  return (
    <Card variant="outlined" sx={{ p: 1 }}>
      <CardHeader
        title={`Seguimiento de la cotización ${quote?.orderNumber}`}
        action={headerAction}
        sx={(theme) => ({
          paddingBottom: 0,
          color: theme.palette.primary.hover,
          mb: { xs: 2, md: 4 },
        })}
      />
      <CardContent sx={{ pt: 0, pb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} mb={2}>
            <EditableStatusStepper
              activeStep={activeIdx}
              justSavedIdx={justSavedIdx}
              onStepClick={handleStepClick}
            />
            {showAlert && (
              <Alert severity="info" sx={{ marginTop: { xs: 2, md: 4 } }}>
                Haz clic en otro paso para habilitar “Guardar estado”
              </Alert>
            )}
          </Grid>

          <InfoRow
            icon={<Person />}
            label="Cliente"
            value={`${quote?.User?.firstName} ${quote?.User?.lastName}`}
          />
          <InfoRow icon={<Email />} label="Email" value={quote?.User?.email} />
          <InfoRow
            icon={<Phone />}
            label="Teléfono"
            value={quote?.User?.phoneNumber}
          />
          <InfoRow
            icon={<CalendarToday />}
            label="Fecha"
            value={formatDateDayAbrev(quote?.createdAt)}
          />
          <InfoRow icon={<Message />} label="Mensaje" value={quote?.message} />

          <Grid item xs={12}>
            <Grid container spacing={2} justifyContent="space-between">
              <Grid item xs={12} md={4}>
                <ActionButton
                  label="Llamar"
                  icon={<Phone />}
                  onClick={onCall}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <ActionButton
                  label="Correo"
                  icon={<Email />}
                  onClick={onEmail}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default QuoteDetails;
