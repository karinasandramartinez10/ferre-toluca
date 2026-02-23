import { Delete } from "@mui/icons-material";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { isRowValid } from "../helpers";
import { AutocompleteCell } from "./AutoCompleteCell";
import { TextFieldCellEditor } from "./TextFieldCellEditor";

const selectStyle = {
  width: "100%",
  height: "100%",
  border: "none",
  background: "transparent",
  font: "inherit",
};

const MeasureDropdown = ({ value, field, measures, params, setRows }) => {
  const handleChange = (e) => {
    const selectedId = parseInt(e.target.value, 10);
    setRows((prevRows) =>
      prevRows.map((r) => (r.id === params.row.id ? { ...params.row, [field]: selectedId } : r))
    );
  };

  return (
    <select value={value || ""} onChange={handleChange} style={selectStyle}>
      <option value="">Selecciona</option>
      {measures.map((m) => (
        <option key={m.id} value={m.id}>
          {m.abbreviation}
        </option>
      ))}
    </select>
  );
};

export const getAddProductColumns = (onDelete, measures, productModels, setRows) => [
  {
    field: "valid",
    headerName: "",
    width: 40,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    renderCell: ({ row }) => {
      return isRowValid(row) ? (
        <span role="img" aria-label="Validado">
          ✅
        </span>
      ) : null;
    },
  },
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
        placeholder: "Ej: Abrazadera de acero inoxidable modelo A4 de la marca ARDA",
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
    width: 90,
    editable: true,
    renderEditCell: (params) =>
      TextFieldCellEditor({
        params,
        placeholder: "Ej: 100",
      }),
  },
  {
    field: "measureId",
    headerName: "Unidad",
    width: 115,
    editable: false,
    renderCell: (params) => (
      <MeasureDropdown
        value={params.row.measureId}
        field="measureId"
        measures={measures}
        params={params}
        setRows={setRows}
      />
    ),
  },
  {
    field: "modelName",
    headerName: "Modelo",
    width: 160,
    editable: false,
    renderCell: (params) => AutocompleteCell({ params, productModels, setRows }),
  },
  {
    field: "qualifier",
    headerName: "Cualificador",
    width: 120,
    editable: true,
    renderEditCell: (params) =>
      TextFieldCellEditor({
        params,
        placeholder: "Ej: Grande, Chica",
      }),
  },
  {
    field: "secondaryMeasureValue",
    headerName: "Valor 2",
    width: 90,
    editable: true,
    renderEditCell: (params) =>
      TextFieldCellEditor({
        params,
        placeholder: "Ej: 50",
      }),
  },
  {
    field: "secondaryMeasureId",
    headerName: "Unidad 2",
    width: 115,
    editable: false,
    renderCell: (params) => (
      <MeasureDropdown
        value={params.row.secondaryMeasureId}
        field="secondaryMeasureId"
        measures={measures}
        params={params}
        setRows={setRows}
      />
    ),
  },
  {
    field: "color",
    headerName: "Color",
    width: 110,
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
