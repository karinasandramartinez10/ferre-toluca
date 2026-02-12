import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock Next.js navigation
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => "/products",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next-auth
vi.mock("next-auth/react", () => ({
  useSession: () => ({ data: { user: { role: "user" } }, status: "authenticated" }),
}));

// Mock MUI hooks
vi.mock("@mui/material", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    useMediaQuery: () => false, // desktop mode
  };
});

// Mock hooks
const mockToggleFilter = vi.fn();
const mockClearFilters = vi.fn();
const mockSetCurrentPage = vi.fn();

vi.mock("../../../hooks/filters", () => ({
  useFilterOptions: () => ({
    options: {
      brands: [
        { id: 1, name: "truper", count: 10 },
        { id: 2, name: "stanley", count: 5 },
      ],
      categories: [{ id: 3, name: "herramientas", count: 15 }],
      subcategories: [],
      types: [],
      models: [],
      measures: [],
      designs: [],
    },
    loading: false,
  }),
  useProductFilters: () => ({
    filters: {},
    urlFilters: { brandIds: [1] },
    toggleFilter: mockToggleFilter,
    clearFilters: mockClearFilters,
    hasActiveFilters: true,
  }),
  useFilteredProducts: () => ({
    products: [{ variantGroupKey: "vg1", variants: [{ id: "p1", name: "Martillo" }] }],
    count: 1,
    totalPages: 1,
    loading: false,
    error: null,
    currentPage: 1,
    setCurrentPage: mockSetCurrentPage,
  }),
}));

// Mock child components to simplify
vi.mock("../../../components/filters/MobileFilterDrawer", () => ({
  default: () => null,
}));

vi.mock("../../../components/GroupedProductsList", () => ({
  default: ({ groupedResult }: { groupedResult: { count: number } }) => (
    <div data-testid="product-list">{groupedResult.count} products rendered</div>
  ),
}));

import ProductsWithFilters from "../../../components/filters/ProductsWithFilters";

describe("ProductsWithFilters", () => {
  it("renders the title and product count", () => {
    render(<ProductsWithFilters title="Herramientas" />);

    expect(screen.getByRole("heading", { name: "Herramientas" })).toBeInTheDocument();
    expect(screen.getByText(/1 producto encontrado/)).toBeInTheDocument();
  });

  it("renders active filter chips", () => {
    render(<ProductsWithFilters title="Productos" />);

    expect(screen.getByText("Marca: Truper")).toBeInTheDocument();
  });

  it("renders clear all chip when there are active filters", () => {
    render(<ProductsWithFilters title="Productos" />);

    expect(screen.getByText("Limpiar todos")).toBeInTheDocument();
  });

  it("calls clearFilters when clear chip is clicked", async () => {
    const user = userEvent.setup();
    render(<ProductsWithFilters title="Productos" />);

    await user.click(screen.getByText("Limpiar todos"));
    expect(mockClearFilters).toHaveBeenCalled();
  });

  it("calls toggleFilter when a chip delete is clicked", async () => {
    const user = userEvent.setup();
    render(<ProductsWithFilters title="Productos" />);

    // The chip with "Marca: Truper" has a delete button
    const chip = screen.getByText("Marca: Truper").closest(".MuiChip-root");
    const deleteButton = chip!.querySelector(".MuiChip-deleteIcon");
    await user.click(deleteButton!);

    expect(mockToggleFilter).toHaveBeenCalledWith("brandIds", 1);
  });

  it("renders the product list", () => {
    render(<ProductsWithFilters title="Productos" />);

    expect(screen.getByTestId("product-list")).toBeInTheDocument();
  });

  it("renders the filter sidebar on desktop", () => {
    render(<ProductsWithFilters title="Productos" />);

    // FilterSidebar should render with "Filtros" heading
    expect(screen.getByText("Filtros")).toBeInTheDocument();
  });
});
