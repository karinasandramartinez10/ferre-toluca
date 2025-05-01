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
  { field: "code", headerName: "Código", flex: 0.7, minWidth: 130 },
  { field: "name", headerName: "Nombre", flex: 1.5, minWidth: 130 },
  {
    field: "brandName",
    headerName: "Marca",
    flex: 1,
    minWidth: 120,
  },
  {
    field: "categoryName",
    headerName: "Categoría",
    flex: 1,
    minWidth: 130,
  },
  {
    field: "subCategoryName",
    headerName: "Subcategoría",
    flex: 1,
    minWidth: 130,
  },
  {
    field: "typeName",
    headerName: "Tipo",
    flex: 0.8,
    minWidth: 100,
  },
  {
    field: "actions",
    type: "actions",
    headerName: "Acciones",
    flex: 0.4,
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