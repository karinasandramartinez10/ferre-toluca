import { Edit } from "@mui/icons-material";
import { GridActionsCellItem } from "@mui/x-data-grid";

export const textFields = [
  { name: "name", label: "Nombre", required: true },
  { name: "code", label: "Código", required: true },
  { name: "color", label: "Color" },
  { name: "size", label: "Tamaño" },
];

export const multiLineFields = [
  { name: "description", label: "Descripción", required: true },
  { name: "specifications", label: "Especificaciones" },
];

export const selectFields = [
  { label: "Marca", name: "brandId" },
  { label: "Categoría", name: "categoryId" },
  { label: "Subcategoría", name: "subCategoryId" },
  { label: "Tipo", name: "typeId" },
];

export const getSelectOptions = (
  name,
  brands,
  categories,
  subcategories,
  types
) => {
  const optionsMap = {
    brandId: brands,
    categoryId: categories,
    subCategoryId: subcategories,
    typeId: types,
  };
  return optionsMap[name] || [];
};

export const getProductColumns = (onEdit) => [
  // { field: "id", headerName: "ID", flex: 0.5 },
  { field: "code", headerName: "Código", flex: 0.5 },
  { field: "name", headerName: "Nombre", flex: 1 },
  {
    field: "brand",
    headerName: "Marca",
    flex: 1,
    renderCell: (params) => params.row.brand?.name || "Sin marca",
  },
  {
    field: "category",
    headerName: "Categoría",
    flex: 1,
    renderCell: (params) => params.row.category?.name || "Sin categoría",
  },
  {
    field: "subcategory",
    headerName: "Subcategoría",
    flex: 1,
    renderCell: (params) => params.row.subCategory?.name || "Sin subcategoría",
  },
  {
    field: "type",
    headerName: "Tipo",
    flex: 1,
    renderCell: (params) => params.row.type?.name || "",
  },
  {
    field: "actions",
    type: "actions",
    headerName: "Acciones",
    flex: 0.5,
    getActions: ({ row }) => [
      <GridActionsCellItem
        key={`edit-${row.id}`}
        icon={<Edit />}
        label="Edit"
        onClick={() => onEdit(row)}
        color="inherit"
      />,
    ],
  },
];
