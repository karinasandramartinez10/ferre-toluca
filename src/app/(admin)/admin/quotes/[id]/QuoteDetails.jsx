import {
  CalendarToday,
  Email,
  Message,
  Person,
  Phone,
} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Card, CardContent, CardHeader, Grid } from "@mui/material";
import { formatDateDayAbrev } from "../../../../../utils/date";
import ActionButton from "./ActionButton";
import InfoRow from "./InfoRow";

const QuoteDetails = ({
  quote,
  onCall,
  onEmail,
  onMarkAsRead,
  isRead,
  loadingRead,
}) => (
  <Card variant="outlined">
    <CardHeader title={quote?.orderNumber} sx={{ paddingBottom: 0 }} />
    <CardContent>
      <Grid container spacing={2}>
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
              <ActionButton label="Llamar" icon={<Phone />} onClick={onCall} />
            </Grid>
            <Grid item xs={12} md={4}>
              <ActionButton label="Correo" icon={<Email />} onClick={onEmail} />
            </Grid>
            <Grid item xs={12} md={4}>
              <LoadingButton
                sx={(theme) => ({
                  background: isRead
                    ? theme.palette.grey.main
                    : theme.palette.green.main,
                  color: "#FFF",
                  "&:hover": {
                    background: isRead
                      ? theme.palette.grey.main
                      : theme.palette.green.hover,
                  },
                })}
                onClick={onMarkAsRead}
                disabled={isRead}
                fullWidth
                loading={loadingRead}
              >
                {isRead ? "Leído" : "Marcar como leído"}
              </LoadingButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

export default QuoteDetails;
