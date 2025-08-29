import { Edit } from "@mui/icons-material";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { toCapitalizeFirstLetter } from "../../../../utils/cases";

export const textFields = [
  { name: "name", label: "Nombre", required: true },
  { name: "code", label: "Código", required: true },
  { name: "color", label: "Color" },
  // { name: "size", label: "Tamaño" },
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
  const opts = optionsMap[name];
  return Array.isArray(opts) ? opts : [];
};

export const getProductColumns = (onEdit) => [
  {
    field: "actions",
    type: "actions",
    headerName: "Acciones",
    width: 90,
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
  { field: "code", headerName: "Código", width: 125 },
  { field: "name", headerName: "Nombre", width: 260 },
  {
    field: "brandName",
    headerName: "Marca",
    width: 160,
  },
  {
    field: "categoryName",
    headerName: "Categoría",
    width: 220,
  },
  {
    field: "subCategoryName",
    headerName: "Subcategoría",
    width: 200,
  },
  {
    field: "typeName",
    headerName: "Tipo",
    width: 140,
  },
  {
    field: "modelName",
    headerName: "Modelo",
    width: 150,
    valueGetter: (_, row) =>
      toCapitalizeFirstLetter(row?.productModel?.name) || "",
  },
];
