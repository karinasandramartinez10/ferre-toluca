import { Edit } from "@mui/icons-material";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { toCapitalizeWords } from "../../../../utils/cases";

export const textFields = [
  { name: "name", label: "Nombre", required: true },
  { name: "code", label: "Código", required: true },
  { name: "color", label: "Color" },
  { name: "qualifier", label: "Cualificador" },
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

export const getSelectOptions = (name, brands, categories, subcategories, types) => {
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
  {
    field: "name",
    headerName: "Nombre",
    width: 260,
    valueGetter: (_, row) => (row?.name ? toCapitalizeWords(row?.name) : ""),
  },
  {
    field: "brandName",
    headerName: "Marca",
    width: 160,
    valueGetter: (_, row) => (row?.brand?.name ? toCapitalizeWords(row?.brand?.name) : ""),
  },
  {
    field: "categoryName",
    valueGetter: (_, row) => (row?.category?.name ? toCapitalizeWords(row?.category?.name) : ""),
    headerName: "Categoría",
    width: 220,
  },
  {
    field: "subCategoryName",
    valueGetter: (_, row) =>
      row?.subCategory?.name ? toCapitalizeWords(row?.subCategory?.name) : "",
    headerName: "Subcategoría",
    width: 200,
  },
  {
    field: "typeName",
    valueGetter: (_, row) => (row?.type?.name ? toCapitalizeWords(row?.type?.name) : ""),
    headerName: "Tipo",
    width: 140,
  },
  {
    field: "modelName",
    headerName: "Modelo",
    width: 150,
    valueGetter: (_, row) =>
      row?.productModel?.name ? toCapitalizeWords(row?.productModel?.name) : "",
  },
];
