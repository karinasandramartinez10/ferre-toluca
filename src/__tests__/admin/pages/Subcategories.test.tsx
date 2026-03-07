import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("notistack", () => ({
  useSnackbar: () => ({ enqueueSnackbar: vi.fn() }),
}));

// Mock CrudAdminTable to avoid DataGrid CSS issues in jsdom
vi.mock("@/components/CrudAdminTable", () => ({
  default: ({ title, handleClick, rows }: any) => (
    <div data-testid="crud-table">
      <button onClick={handleClick}>Agregar otra {title}</button>
      <ul>
        {rows.map((r: any) => (
          <li key={r.id}>{r.name}</li>
        ))}
      </ul>
    </div>
  ),
}));

const mockGetSubcategories = vi.fn();
const mockCreateSubcategory = vi.fn();
const mockUpdateSubcategory = vi.fn();
const mockGetCategories = vi.fn();

vi.mock("@/api/subcategories", () => ({
  getSubcategories: (...args: unknown[]) => mockGetSubcategories(...args),
  createSubcategory: (...args: unknown[]) => mockCreateSubcategory(...args),
  updateSubcategory: (...args: unknown[]) => mockUpdateSubcategory(...args),
}));

vi.mock("@/api/category", () => ({
  getCategories: (...args: unknown[]) => mockGetCategories(...args),
}));

vi.mock("@/actions/revalidate", () => ({
  revalidateSubcategoryPage: vi.fn(),
}));

import Subcategories from "@/app/(admin)/admin/subcategories/Subcategories";

const sampleSubcategories = [
  { id: "sc1", name: "taladros", category: { id: "c1", name: "herramientas" } },
  { id: "sc2", name: "cables", category: { id: "c2", name: "electricidad" } },
];

const sampleCategories = [
  { id: "c1", name: "herramientas" },
  { id: "c2", name: "electricidad" },
];

beforeEach(() => {
  vi.clearAllMocks();
  mockGetSubcategories.mockResolvedValue({ subcategories: sampleSubcategories, count: 2 });
  mockGetCategories.mockResolvedValue({ categories: sampleCategories });
});

describe("Subcategories page", () => {
  it("fetches subcategories on mount", async () => {
    render(<Subcategories />);

    await waitFor(() => {
      expect(mockGetSubcategories).toHaveBeenCalledWith({ page: 1, size: 10 });
    });
  });

  it("fetches categories for the filter select", async () => {
    render(<Subcategories />);

    await waitFor(() => {
      expect(mockGetCategories).toHaveBeenCalledWith({ size: 1000 });
    });
  });

  it("renders fetched subcategories", async () => {
    render(<Subcategories />);

    await waitFor(() => {
      expect(screen.getByText("taladros")).toBeInTheDocument();
      expect(screen.getByText("cables")).toBeInTheDocument();
    });
  });

  it("opens add modal when clicking add button", async () => {
    render(<Subcategories />);
    const user = userEvent.setup();

    await waitFor(() => expect(mockGetSubcategories).toHaveBeenCalled());

    await user.click(screen.getByText(/Agregar otra subcategoría/i));

    expect(screen.getByText("Agregar Subcategoría")).toBeInTheDocument();
  });

  it("renders category filter select in modal", async () => {
    render(<Subcategories />);
    const user = userEvent.setup();

    await waitFor(() => expect(mockGetSubcategories).toHaveBeenCalled());

    await user.click(screen.getByText(/Agregar otra subcategoría/i));

    await waitFor(() => {
      expect(screen.getByText("Selecciona la categoría a asociar")).toBeInTheDocument();
    });
  });
});
