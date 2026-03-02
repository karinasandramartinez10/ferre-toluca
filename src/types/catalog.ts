export interface Brand {
  id: string;
  name: string;
  image?: string;
  codeName?: string;
  imageUrl?: string;
  File?: { path: string };
}

export interface Category {
  id: string;
  name: string;
  path?: string;
}

export interface Subcategory {
  id: string;
  name: string;
  category?: Category;
}

export interface ProductType {
  id: string;
  name: string;
  subCategory?: Subcategory;
}

export interface Measure {
  id: string;
  name: string;
  abbreviation: string;
}

export interface ProductModel {
  id: string;
  name: string;
}

export interface PaginationParams {
  page?: number;
  size?: number;
}

export interface CategoriesParams extends PaginationParams {
  categoryId?: string;
}

export interface SubcategoriesParams extends PaginationParams {
  categoryId?: string;
}

export interface ProductTypesParams extends PaginationParams {
  subcategoryId?: string;
}

export interface CategoriesResponse {
  categories: Category[];
  count: number;
  totalPages: number;
}

export interface SubcategoriesResponse {
  subcategories: Subcategory[];
  count: number;
  totalPages: number;
}

export interface BrandsResponse {
  brands: Brand[];
  count: number;
  totalPages: number;
}

export interface ProductTypesResponse {
  productTypes: ProductType[];
  count: number;
  totalPages: number;
}

export interface BrandsParams extends PaginationParams {}

export interface CategoryBody {
  name: string;
}

export interface SubcategoryBody {
  name: string;
  categoryId: string;
}
