"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { formatShortDate } from "../../../../utils/date";
import {
  CONTACT_REQUEST_STATUS_COLORS,
  CONTACT_REQUEST_STATUS_LABELS,
  CONTACT_REQUEST_TERMINAL_STATUSES,
} from "../../../../constants/statusMaps";
import ContactDialog from "./ContactDialog";

const isTerminal = (status) => CONTACT_REQUEST_TERMINAL_STATUSES.includes(status);

const ContactRequestCard = ({ request, processing, onAction }) => {
  const [contactOpen, setContactOpen] = useState(false);
  const fullName = `${request.firstName} ${request.lastName}`.trim();
  const terminal = isTerminal(request.status);

  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardContent sx={{ pb: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle1" fontWeight={600} noWrap>
              {fullName}
            </Typography>
            {request.companyName && (
              <Typography variant="body2" color="text.secondary" noWrap>
                {request.companyName}
              </Typography>
            )}
          </Box>
          <Stack alignItems="flex-end" spacing={0.5} sx={{ flexShrink: 0 }}>
            <Chip
              label={CONTACT_REQUEST_STATUS_LABELS[request.status]}
              size="small"
              color={CONTACT_REQUEST_STATUS_COLORS[request.status] || "default"}
            />
            <Typography variant="caption" color="text.secondary">
              {formatShortDate(request.createdAt)}
            </Typography>
          </Stack>
        </Stack>

        <Stack
          direction="row"
          spacing={1.5}
          sx={{ mt: 1, color: "text.secondary", flexWrap: "wrap" }}
        >
          <Typography variant="body2">{request.email}</Typography>
          {request.phoneNumber && <Typography variant="body2">· {request.phoneNumber}</Typography>}
        </Stack>

        {request.message ? (
          <Typography
            variant="body2"
            sx={{ mt: 1.5, p: 1.5, bgcolor: "grey.light", borderRadius: 1, whiteSpace: "pre-wrap" }}
          >
            {request.message}
          </Typography>
        ) : (
          <Typography variant="body2" color="text.disabled" sx={{ mt: 1.5, fontStyle: "italic" }}>
            Sin mensaje
          </Typography>
        )}
      </CardContent>

      {!terminal && (
        <CardActions sx={{ px: 2, pb: 2, pt: 0, justifyContent: "flex-end" }}>
          {processing ? (
            <CircularProgress size={22} sx={{ mr: 1 }} />
          ) : (
            <>
              <Button
                size="small"
                variant="text"
                color="error"
                onClick={() => onAction(request, "rejected")}
              >
                Rechazar
              </Button>
              {request.status === "pending" && (
                <Button
                  size="small"
                  variant="outlined"
                  color="inherit"
                  onClick={() => setContactOpen(true)}
                >
                  Contactar
                </Button>
              )}
              <Button size="small" variant="contained" onClick={() => onAction(request, "invited")}>
                Invitar
              </Button>
            </>
          )}
        </CardActions>
      )}

      <ContactDialog
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        request={request}
        onConfirm={() => {
          setContactOpen(false);
          onAction(request, "contacted");
        }}
      />
    </Card>
  );
};

export default ContactRequestCard;
