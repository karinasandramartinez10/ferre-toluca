import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Collapse,
  Divider,
  Grid,
  IconButton,
  List,
  Typography,
} from "@mui/material";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import { format } from "date-fns";
import Image from "next/image";
import { useState } from "react";

const HistoryList = ({ orders }) => {
  const [expandedOrder, setExpandedOrder] = useState(null);

  const handleToggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <Box>
      {orders.map((order) => (
        <Card key={order.id} sx={{ marginBottom: 3, padding: 2 }}>
          <CardHeader
            title={`Orden #${order.id}`}
            subheader={`Fecha: ${format(
              new Date(order.createdAt),
              "dd/MM/yyyy HH:mm"
            )}`}
            action={
              <IconButton
                onClick={() => handleToggleExpand(order.id)}
                aria-expanded={expandedOrder === order.id}
                aria-label="Mostrar productos"
              >
                <ExpandMoreIcon
                  sx={{
                    transform:
                      expandedOrder === order.id
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                    transition: "transform 0.3s",
                  }}
                />
              </IconButton>
            }
          />
          <Divider />
          <CardContent>
            <Typography variant="body2" sx={{ marginBottom: 1 }}>
              <strong>Mensaje:</strong> {order.message || "Sin mensaje"}
            </Typography>
            <Collapse
              in={expandedOrder === order.id}
              timeout="auto"
              unmountOnExit
            >
              <Typography variant="body2">
                <strong>Productos:</strong>
              </Typography>
              <List>
                <Grid container spacing={2}>
                  {order.Products.map((product) => (
                    <Grid item xs={12} sm={6} md={4} key={product.id}>
                      <Card
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          padding: 2,
                          gap: 2,
                          boxShadow: "none",
                          border: "1px solid #ddd",
                        }}
                      >
                        <Image
                          src={product.Files[0]?.path || "/fallback-image.jpg"}
                          alt={product.name}
                          width={50}
                          height={50}
                          style={{
                            objectFit: "contain",
                            borderRadius: "8px",
                          }}
                        />
                        <Box>
                          <Typography variant="body1">
                            {product.name}
                          </Typography>
                          <Typography variant="body2">
                            x {product.QuoteProduct.quantity}
                          </Typography>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </List>
            </Collapse>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default HistoryList;
