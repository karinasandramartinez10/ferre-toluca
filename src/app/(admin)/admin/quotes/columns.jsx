import Link from "next/link";
import { IconButton, Stack } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { calculateTotalQuantity } from "./utils";
import { formatPhoneNumber } from "../../../../utils/phoneNumber";
import { formatDateDayAbrev } from "../../../../utils/date";

export const quotesColumns = [
  {
    field: "actions",
    headerName: "Detalle",
    width: 85,
    renderCell: (params) => (
      <Stack>
        <Link href={`/admin/quotes/${params.row.id}`} passHref>
          <IconButton>
            <Visibility />
          </IconButton>
        </Link>
      </Stack>
    ),
  },
  // { field: "id", headerName: "ID", width: 85 },
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
