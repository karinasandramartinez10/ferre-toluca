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
  Button,
} from "@mui/material";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import { format } from "date-fns";
import { ProductItem } from "./ProductItem";
import StatusChipCompact from "./StatusChipCompact";
import { useRouter } from "next/navigation";

const QuoteCard = ({ order, expanded, onToggle }) => {
  const router = useRouter();
  return (
    <Card
      key={order.orderNumber}
      variant="outlined"
      sx={{
        padding: 1,
        display: "flex",
        flexDirection: "column",
        ...(expanded && { height: "100%" }),
        transition: "box-shadow 0.3s, height 0.3s",
        "&:hover": { boxShadow: 3 },
      }}
    >
      <Box sx={{ flexGrow: 0 }}>
        <CardHeader
          title={`#${order.orderNumber}`}
          titleTypographyProps={{ variant: "subtitle1", fontWeight: 600 }}
          subheader={`Fecha: ${format(
            new Date(order.createdAt),
            "dd/MM/yyyy HH:mm"
          )}`}
          subheaderTypographyProps={{
            variant: "body3",
            color: "text.secondary",
          }}
          action={
            <IconButton
              size="small"
              onClick={onToggle}
              aria-expanded={expanded}
              aria-label="Mostrar productos"
            >
              <ExpandMoreIcon
                sx={{
                  transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.3s",
                }}
              />
            </IconButton>
          }
        />
      </Box>

      {/* Estado compacto para evitar overflow en cards con sidebar */}
      <Box display="flex" justifyContent="flex-start" px={1} pb={2}>
        <StatusChipCompact status={order.status} />
      </Box>
      <Divider />
      <CardContent sx={{ p: 1, flexGrow: 1, pb: "0px !important" }}>
        <Typography variant="body2" gutterBottom noWrap>
          <strong>Mensaje:</strong> {order.message || "Sin mensaje"}
        </Typography>
        <Box display="flex" justifyContent="flex-start" pt={1} mb={1}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => router.push(`/user/profile/history/${order.id}`)}
          >
            Ver detalle
          </Button>
        </Box>

        <Collapse in={expanded} timeout={300} unmountOnExit>
          <Typography variant="body2">
            <strong>Productos:</strong>
          </Typography>
          <Box
            sx={{
              maxHeight: 200,
              overflowY: "auto",
              pr: 1,
            }}
          >
            <List>
              <Grid container spacing={1}>
                {order.Products.map((product) => (
                  <Grid item xs={12} key={product.orderNumber}>
                    <ProductItem product={product} />
                  </Grid>
                ))}
              </Grid>
            </List>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default QuoteCard;
