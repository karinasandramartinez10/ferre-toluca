import Link from "next/link";
import {
  Box,
  Chip,
  CircularProgress,
  IconButton,
  MenuItem,
  Select,
} from "@mui/material";
import { DescriptionOutlined, SettingsOutlined } from "@mui/icons-material";
import { formatPhoneNumber } from "../../../../utils/phoneNumber";
import { formatDateDayAbrev } from "../../../../utils/date";
import { STEPS } from "../../../../constants/quotes/status";
import { getDefaultFiscalProfile } from "../../../../utils/fiscal";

export const getQuoteColumns = ({
  updatingId,
  handleStatusChange,
  editingId,
  setEditingId,
  finishEdit,
}) => [
  {
    field: "actions",
    headerName: "Ver detalle",
    width: 110,
    align: "center", // Centra el contenido dentro de la celda
    sortable: false,
    renderCell: (params) => (
      <Link href={`/admin/quotes/${params.row.id}`} passHref>
        <IconButton
          sx={{
            mx: "auto", // Centra horizontalmente si fuera necesario
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <DescriptionOutlined />
        </IconButton>
      </Link>
    ),
  },
  {
    field: "status",
    headerName: "Estado",
    width: 220,
    sortable: true,
    cellClassName: "statusCell",
    renderCell: ({ row: { id, status } }) => {
      if (updatingId === id) {
        return <CircularProgress size={20} />;
      }

      if (editingId === id) {
        return (
          <Select
            size="small"
            value={status}
            autoFocus
            onBlur={finishEdit}
            onChange={async (e) => {
              const newStatus = e.target.value;
              await handleStatusChange(id, status, newStatus);
              finishEdit();
            }}
            sx={{ minWidth: 160 }}
          >
            {STEPS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        );
      }

      const colorMap = {
        IN_REVIEW: "secondary",
        PARTIALLY_AVAILABLE: "warning",
        READY_FOR_DISPATCH: "info",
        DISPATCHED: "success",
      };

      return (
        <Box
          sx={{
            position: "relative",
            width: "100%",
            alignItems: "center",
            // justifyContent: "center",
            height: "100%",
            px: 1,
            display: "flex",
          }}
        >
          <Chip
            label={STEPS.find((o) => o.value === status).label}
            color={colorMap[status]}
            onClick={() => setEditingId(id)}
            sx={{ cursor: "pointer" }}
          />
          <IconButton
            size="small"
            className="editIcon"
            sx={{
              display: "none",
              position: "absolute",
              top: "50%",
              right: 8,
              transform: "translateY(-50%)",
            }}
            onClick={() => setEditingId(id)}
          >
            <SettingsOutlined fontSize="small" />
          </IconButton>
        </Box>
      );
    },
  },
  { field: "orderNumber", headerName: "# Orden", width: 110 },
  {
    field: "fullname",
    headerName: "Cliente",
    sortable: true,
    width: 150,
    valueGetter: (_, row) =>
      `${row?.User?.firstName || ""} ${row?.User?.lastName || ""}`,
  },
  {
    field: "email",
    headerName: "Email",
    width: 170,
    sortable: true,
    valueGetter: (_, row) => row?.User?.email || "",
  },
  {
    field: "phoneNumber",
    headerName: "Teléfono",
    width: 140,
    valueGetter: (_, row) => formatPhoneNumber(row?.User?.phoneNumber) || "",
  },
  {
    field: "fiscalName",
    headerName: "Razón social",
    width: 200,
    sortable: false,
    valueGetter: (_, row) => {
      const chosen = getDefaultFiscalProfile(row?.User?.fiscalProfiles);
      return chosen?.fiscalName || "";
    },
  },
  {
    field: "rfc",
    headerName: "RFC",
    width: 140,
    sortable: false,
    valueGetter: (_, row) => {
      const chosen = getDefaultFiscalProfile(row?.User?.fiscalProfiles);
      return chosen?.rfc || "";
    },
  },
  {
    field: "createdAt",
    headerName: "Fecha",
    width: 140,
    valueFormatter: (val) => {
      if (val == null) {
        return "";
      }
      return formatDateDayAbrev(val);
    },
  },
];
