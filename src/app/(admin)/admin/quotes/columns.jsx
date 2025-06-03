import Link from "next/link";
import { IconButton } from "@mui/material";
import { DescriptionOutlined } from "@mui/icons-material";
import { calculateTotalQuantity } from "./utils";
import { formatPhoneNumber } from "../../../../utils/phoneNumber";
import { formatDateDayAbrev } from "../../../../utils/date";

export const quotesColumns = [
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
  { field: "orderNumber", headerName: "# Orden", width: 110 },
  {
    field: "fullname",
    headerName: "Cliente",
    sortable: true,
    width: 170,
    valueGetter: (_, row) =>
      `${row?.User?.firstName || ""} ${row?.User?.lastName || ""}`,
  },
  {
    field: "product",
    headerName: "# Productos",
    width: 150,
    valueGetter: (_, row) => row?.Products?.length || "",
  },
  {
    field: "quantity",
    headerName: "Cantidad Total",
    width: 150,
    valueGetter: (_, row) => calculateTotalQuantity(row?.Products),
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
    width: 150,
    valueGetter: (_, row) => formatPhoneNumber(row?.User?.phoneNumber) || "",
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
