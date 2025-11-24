import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { format } from "date-fns";
import { localeText } from "../../../../../constants/x-datagrid/localeText";
import { statusLabelMap } from "../../../../../helpers/quotes";
import { statusLogColumns } from "./columns";

export function StatusLogList({ logs, loading }) {
  const rows = logs.map((log) => ({
    id: log.id,
    admin: log.changedBy,
    change: `${statusLabelMap[log.oldStatus] || log.oldStatus}
             → ${statusLabelMap[log.newStatus] || log.newStatus}`,
    date: format(new Date(log.changedAt), "dd/MM/yyyy, HH:mm"),
  }));

  return (
    <Card variant="outlined" sx={{ p: 1 }}>
      <CardHeader title="Historial de cambios" />
      <CardContent sx={{ pt: 0 }}>
        {loading && <Typography>Cargando historial…</Typography>}
        <DataGrid
          localeText={localeText}
          rows={rows}
          columns={statusLogColumns}
          pageSizeOptions={[5, 10]}
          initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
          disableRowSelectionOnClick
          hideFooterSelectedRowCount
          density="compact"
        />
      </CardContent>
    </Card>
  );
}

