"use client";

import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { fetchQuoteMessages, sendQuoteMessage } from "../api/quote";
import { formatDateDayAbrev } from "../utils/date";
import { useRef } from "react";
import { useSession } from "next-auth/react";
import { palette } from "../theme/palette";
import { toCapitalizeWords } from "../utils/cases";

export default function QuoteMessages({ quoteId }) {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const { data: session } = useSession();
  const userId = session?.user?.id;

  const loadMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const msgs = await fetchQuoteMessages(quoteId);
      setMessages(
        msgs.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      );
    } catch (err) {
      setError("No se pudieron cargar los mensajes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (quoteId) loadMessages();
    // eslint-disable-next-line
  }, [quoteId]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSending(true);
    setError(null);
    try {
      await sendQuoteMessage(quoteId, content);
      setContent("");
      await loadMessages();
    } catch (err) {
      setError("No se pudo enviar el mensaje");
    } finally {
      setSending(false);
    }
  };

  return (
    <Stack gap={2}>
      <Box>
        <Box minHeight={120}>
          {loading ? (
            <Typography variant="body2">Cargando mensajes...</Typography>
          ) : error ? (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          ) : messages.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No hay mensajes aún.
            </Typography>
          ) : (
            messages.map((msg, idx) => {
              const isMine = String(msg.senderId) === String(userId);
              return (
                <Box
                  key={msg.id}
                  display="flex"
                  justifyContent={isMine ? "flex-end" : "flex-start"}
                  width="100%"
                  mb={1}
                >
                  <Box
                    sx={{
                      bgcolor: isMine
                        ? palette.palette.primary.main
                        : palette.palette.grey.main,
                      color: isMine ? "#fff" : palette.palette.grey.main,
                      borderRadius: 2,
                      p: 1,
                      minWidth: 120,
                      wordBreak: "break-word",
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <Typography
                        variant="caption"
                        fontWeight={700}
                        color="#fff"
                      >
                        {isMine
                          ? "Tú"
                          : toCapitalizeWords(
                              `${msg.sender?.firstName}  ${msg.sender?.lastName}`
                            )}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      fontWeight={500}
                      sx={{ mb: 0, color: "#FFF" }}
                    >
                      {msg.content}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="#fff"
                      sx={{ fontSize: "0.75rem" }}
                    >
                      {formatDateDayAbrev(msg.createdAt)}
                    </Typography>
                    {idx === messages.length - 1 && (
                      <div ref={messagesEndRef} />
                    )}
                  </Box>
                </Box>
              );
            })
          )}
        </Box>
      </Box>
      <Box component="form" display="flex" gap={1} onSubmit={handleSend}>
        <TextField
          size="small"
          fullWidth
          placeholder="Escribe un mensaje..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={sending}
        />
        <Button
          variant="contained"
          type="submit"
          disabled={!content.trim() || sending}
        >
          Enviar
        </Button>
      </Box>
    </Stack>
  );
}
