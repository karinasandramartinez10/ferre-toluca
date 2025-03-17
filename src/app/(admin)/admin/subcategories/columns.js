export const subcategoriesColumns = [
  { field: "name", headerName: "Nombre", flex: 1 },
  {
    field: "category",
    headerName: "Categoría Asociada",
    renderCell: (params) => params.row.category?.name || "Sin categoría",
    flex: 1,
  },
];
