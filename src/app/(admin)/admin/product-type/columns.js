export const productTypesColumns = [
  { field: "name", headerName: "Nombre", flex: 1 },
  {
    field: "subcategory",
    headerName: "Subcategoría Asociada",
    renderCell: (params) => params.row.subCategory?.name || "Sin subcategoría",
    flex: 1,
  },
];
