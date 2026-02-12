export const queryKeys = {
  // STATIC — catálogos, estructura de navegación
  menuTree: ["menu-tree"],
  fiscalCatalogs: ["fiscalCatalogs"],

  // DYNAMIC — cambian con acciones del usuario, se invalidan con mutations
  favorites: ["favorites"],
  userFiscals: ["userFiscals"],
  statusLogs: (quoteId) => ["statusLogs", quoteId],
  orderHistory: (filters) => ["orderHistory", filters],

  // FREQUENT — dependen de filtros, cambian con cada interacción
  filteredProducts: (filtersKey, page, pageSize) => [
    "filteredProducts",
    filtersKey,
    page,
    pageSize,
  ],
  filterOptions: (filters) => [
    "filterOptions",
    {
      brandIds: filters.brandIds || [],
      categoryIds: filters.categoryIds || [],
      subcategoryIds: filters.subcategoryIds || [],
      typeIds: filters.typeIds || [],
      modelIds: filters.modelIds || [],
      measureIds: filters.measureIds || [],
      designIds: filters.designIds || [],
    },
  ],
};
