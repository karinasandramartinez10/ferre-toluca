import type { QuoteId, OrderHistoryFilters } from "../types/quote";
import type { SelectedFilters } from "../types/filters";
import type { PricingMode } from "../types/pricing";

export const queryKeys = {
  // STATIC — catálogos, estructura de navegación
  menuTree: (pricingMode: PricingMode = "retail") => ["menu-tree", pricingMode],
  fiscalCatalogs: ["fiscalCatalogs"],
  measures: ["measures"],
  productModels: (brandId?: string) => ["productModels", brandId ?? "all"],
  productTypesBySubcategory: (subcategoryId: string) => [
    "productTypes",
    "bySubcategory",
    subcategoryId,
  ],

  // DYNAMIC — cambian con acciones del usuario, se invalidan con mutations
  favorites: ["favorites"],
  userFiscals: ["userFiscals"],
  quote: (quoteId: QuoteId) => ["quote", quoteId],
  statusLogs: (quoteId: QuoteId) => ["statusLogs", quoteId],
  orderHistory: (filters: OrderHistoryFilters) => ["orderHistory", filters] as const,

  // FREQUENT — dependen de filtros, cambian con cada interacción
  filteredProducts: (
    filtersKey: string,
    page: number,
    pageSize: number,
    pricingMode: PricingMode = "retail"
  ) => ["filteredProducts", filtersKey, page, pageSize, pricingMode],
  filterOptions: (filters: SelectedFilters, pricingMode: PricingMode = "retail") => [
    "filterOptions",
    {
      brandIds: filters.brandIds || [],
      categoryIds: filters.categoryIds || [],
      subcategoryIds: filters.subcategoryIds || [],
      typeIds: filters.typeIds || [],
      modelIds: filters.modelIds || [],
      measureIds: filters.measureIds || [],
      secondaryMeasureIds: filters.secondaryMeasureIds || [],
      designIds: filters.designIds || [],
      qualifiers: filters.qualifiers || [],
    },
    pricingMode,
  ],

  // ADMIN — invitaciones, solicitudes de contacto, settings
  invitations: (page: number, size: number, status?: string) => [
    "invitations",
    page,
    size,
    status ?? "all",
  ],
  invitationValidation: (token: string) => ["invitationValidation", token],
  contactRequests: (page: number, size: number, status?: string) => [
    "contactRequests",
    page,
    size,
    status ?? "all",
  ],
  adminSettings: ["adminSettings"],
};
