export interface FilterOption {
  id: number | string;
  name: string;
  count?: number;
}

export interface MeasureOption extends FilterOption {
  abbreviation?: string;
}

export interface FilterOptions {
  brands?: FilterOption[];
  categories?: FilterOption[];
  subcategories?: FilterOption[];
  types?: FilterOption[];
  models?: FilterOption[];
  measures?: MeasureOption[];
  secondaryMeasures?: MeasureOption[];
  designs?: FilterOption[];
  qualifiers?: FilterOption[];
}

export interface SelectedFilters {
  brandIds?: (number | string)[];
  categoryIds?: (number | string)[];
  subcategoryIds?: (number | string)[];
  typeIds?: (number | string)[];
  modelIds?: (number | string)[];
  measureIds?: (number | string)[];
  secondaryMeasureIds?: (number | string)[];
  designIds?: (number | string)[];
  qualifiers?: (number | string)[];
}
