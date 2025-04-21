import { Delete } from "@mui/icons-material";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { AutocompleteCell } from "./AutoCompleteCell";
import { TextFieldCellEditor } from "./TextFieldCellEditor";

export const getAddProductColumns = (
  onDelete,
  measures,
  productModels,
  setRows
) => [
  {
    field: "name",
    headerName: "Nombre",
    width: 130,
    editable: true,
    renderEditCell: (params) =>
      TextFieldCellEditor({
        params,
        placeholder: "Ej: Abrazadera",
      }),
  },
  {
    field: "code",
    headerName: "Código",
    width: 100,
    editable: true,
    renderEditCell: (params) =>
      TextFieldCellEditor({
        params,
        placeholder: "Ej: A4",
      }),
  },
  {
    field: "description",
    headerName: "Descripción",
    width: 170,
    editable: true,
    renderEditCell: (params) =>
      TextFieldCellEditor({
        params,
        placeholder:
          "Ej: Abrazadera de acero inoxidable modelo A4 de la marca ARDA",
      }),
  },
  {
    field: "specifications",
    headerName: "Características",
    width: 150,
    editable: true,
    renderEditCell: (params) =>
      TextFieldCellEditor({
        params,
        placeholder: "Ej: Fabricada en acero inoxidable, ideal ",
      }),
  },
  {
    field: "measureValue",
    headerName: "Valor",
    width: 100,
    editable: true,
    renderEditCell: (params) =>
      TextFieldCellEditor({
        params,
        placeholder: "Ej: 100",
        type: "number",
      }),
  },
  {
    field: "measureId",
    headerName: "Unidad",
    width: 130,
    editable: false,
    renderCell: (params) => {
      const handleChange = (e) => {
        const selectedId = parseInt(e.target.value, 10);
        const updatedRow = {
          ...params.row,
          measureId: selectedId,
        };

        // ✅ Actualiza el row directo en el estado
        setRows((prevRows) =>
          prevRows.map((r) => (r.id === params.row.id ? updatedRow : r))
        );
      };

      return (
        <select
          value={params.row.measureId || ""}
          onChange={handleChange}
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            background: "transparent",
            font: "inherit",
          }}
        >
          <option value="">Selecciona</option>
          {measures.map((m) => (
            <option key={m.id} value={m.id}>
              {m.abbreviation}
            </option>
          ))}
        </select>
      );
    },
  },
  {
    field: "modelName",
    headerName: "Modelo",
    width: 180,
    editable: false,
    renderCell: (params) =>
      AutocompleteCell({ params, productModels, setRows }),
  },
  {
    field: "color",
    headerName: "Color",
    width: 130,
    editable: true,
    renderEditCell: (params) =>
      TextFieldCellEditor({
        params,
        placeholder: "Ej: Azul Metálico",
      }),
  },
  {
    field: "actions",
    type: "actions",
    headerName: "Acciones",
    cellClassName: "actions",
    getActions: ({ id }) => {
      return [
        <GridActionsCellItem
          key={`delete-${id}`}
          icon={<Delete />}
          label="Delete"
          onClick={onDelete(id)}
          color="inherit"
        />,
      ];
    },
  },
];
