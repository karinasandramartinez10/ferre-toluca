export const localeText = {
  // General
  noRowsLabel: "Sin registros",
  noResultsOverlayLabel: "No se encontraron resultados",

  // Toolbar
  toolbarColumns: "Columnas",
  toolbarColumnsLabel: "Seleccionar columnas",
  toolbarFilters: "Filtros",
  toolbarFiltersLabel: "Mostrar filtros",
  toolbarFiltersTooltipHide: "Ocultar filtros",
  toolbarFiltersTooltipShow: "Mostrar filtros",
  toolbarFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} filtros activos` : `${count} filtro activo`,
  toolbarDensity: "Tamaño de tabla",
  toolbarDensityLabel: "Tamaño de filas",
  toolbarDensityCompact: "Compacto",
  toolbarDensityStandard: "Estándar",
  toolbarDensityComfortable: "Cómodo",
  toolbarExport: "Exportar datos",
  toolbarExportLabel: "Exportar",
  toolbarExportCSV: "Descargar como CSV",
  toolbarExportPrint: "Imprimir",
  toolbarExportExcel: "Descargar como Excel",
  toolbarQuickFilterPlaceholder: "Buscar…",
  toolbarQuickFilterLabel: "Buscar",
  toolbarQuickFilterDeleteIconLabel: "Borrar",

  // Columns panel
  columnsManagementSearchTitle: "Buscar columna",
  columnsManagementShowHideAllText: "Mostrar/Ocultar todo",
  columnsManagementReset: "Restablecer columnas",
  columnsManagementNoColumns: "No hay columnas disponibles",

  // Filter panel
  filterPanelAddFilter: "Agregar filtro",
  filterPanelRemoveAll: "Eliminar todos",
  filterPanelDeleteIconLabel: "Eliminar",
  filterPanelLogicOperator: "Operador lógico",
  filterPanelOperator: "Operador",
  filterPanelOperatorAnd: "Y",
  filterPanelOperatorOr: "O",
  filterPanelColumns: "Columnas",
  filterPanelInputLabel: "Valor",
  filterPanelInputPlaceholder: "Valor del filtro",

  // Filter operators
  filterOperatorContains: "Contiene",
  filterOperatorDoesNotContain: "No contiene",
  filterOperatorEquals: "Igual a",
  filterOperatorDoesNotEqual: "Distinto de",
  filterOperatorStartsWith: "Empieza con",
  filterOperatorEndsWith: "Termina con",
  filterOperatorIs: "Es",
  filterOperatorNot: "No es",
  filterOperatorAfter: "Después de",
  filterOperatorOnOrAfter: "En o después de",
  filterOperatorBefore: "Antes de",
  filterOperatorOnOrBefore: "En o antes de",
  filterOperatorIsEmpty: "Está vacío",
  filterOperatorIsNotEmpty: "No está vacío",
  filterOperatorIsAnyOf: "Es cualquiera de",

  // Header filters
  columnHeaderFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} filtros activos` : `${count} filtro activo`,
  columnHeaderFiltersLabel: "Mostrar filtros",
  columnHeaderSortIconLabel: "Ordenar",

  // Footer
  footerRowSelected: (count) =>
    count !== 1
      ? `${count.toLocaleString()} filas seleccionadas`
      : `${count.toLocaleString()} fila seleccionada`,
  footerTotalRows: "Total de filas:",
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} de ${totalCount.toLocaleString()}`,

  // Checkbox selection
  checkboxSelectionHeaderName: "Selección",
  checkboxSelectionSelectAllRows: "Seleccionar todas las filas",
  checkboxSelectionUnselectAllRows: "Deseleccionar todas las filas",
  checkboxSelectionSelectRow: "Seleccionar fila",
  checkboxSelectionUnselectRow: "Deseleccionar fila",

  // Actions
  actionsCellMore: "Más",

  // Grouping
  pinToLeft: "Fijar a la izquierda",
  pinToRight: "Fijar a la derecha",
  unpin: "Desfijar",
  treeDataGroupingHeaderName: "Agrupación",
  treeDataExpand: "Ver hijos",
  treeDataCollapse: "Ocultar hijos",
  groupingColumnHeaderName: "Agrupar",
  groupColumn: (name) => `Agrupar por ${name}`,
  unGroupColumn: (name) => `Dejar de agrupar por ${name}`,

  // Detail panel
  detailPanelToggle: "Alternar panel de detalles",
  expandDetailPanel: "Expandir",
  collapseDetailPanel: "Colapsar",

  // Row reordering
  rowReorderingHeaderName: "Reordenar filas",

  // Aggregation
  aggregationMenuItemHeader: "Funciones de agregación",
  aggregationFunctionLabelSum: "Suma",
  aggregationFunctionLabelAvg: "Promedio",
  aggregationFunctionLabelMin: "Mínimo",
  aggregationFunctionLabelMax: "Máximo",
  aggregationFunctionLabelSize: "Tamaño",

  // Boolean cell
  booleanCellTrueLabel: "Sí",
  booleanCellFalseLabel: "No",

  MuiTablePagination: {
    labelRowsPerPage: "Filas por página",
    labelDisplayedRows: ({ from, to, count }) =>
      `${from}–${to} de ${count !== -1 ? count : `más de ${to}`}`,
    // firstIconButtonText: "Primera página",
    // previousIconButtonText: "Página anterior",
    // nextIconButtonText: "Página siguiente",
    // lastIconButtonText: "Última página",
  },
};