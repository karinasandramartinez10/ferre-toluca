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

const mockGetCategories = vi.fn();
const mockCreateCategory = vi.fn();
const mockUpdateCategory = vi.fn();

vi.mock("@/api/category", () => ({
  getCategories: (...args: unknown[]) => mockGetCategories(...args),
  createCategory: (...args: unknown[]) => mockCreateCategory(...args),
  updateCategory: (...args: unknown[]) => mockUpdateCategory(...args),
}));

vi.mock("@/actions/revalidate", () => ({
  revalidateCategoryPage: vi.fn(),
}));

import Categories from "@/app/(admin)/admin/categories/Categories";

const sampleCategories = [
  { id: "c1", name: "herramientas", path: "herramientas" },
  { id: "c2", name: "electricidad", path: "electricidad" },
];

beforeEach(() => {
  vi.clearAllMocks();
  mockGetCategories.mockResolvedValue({ categories: sampleCategories, count: 2 });
});

describe("Categories page", () => {
  it("fetches categories on mount", async () => {
    render(<Categories />);

    await waitFor(() => {
      expect(mockGetCategories).toHaveBeenCalledWith({ page: 1, size: 10 });
    });
  });

  it("renders fetched categories in the table", async () => {
    render(<Categories />);

    await waitFor(() => {
      expect(screen.getByText("herramientas")).toBeInTheDocument();
      expect(screen.getByText("electricidad")).toBeInTheDocument();
    });
  });

  it("opens add modal when clicking add button", async () => {
    render(<Categories />);
    const user = userEvent.setup();

    await waitFor(() => expect(mockGetCategories).toHaveBeenCalled());

    await user.click(screen.getByText(/Agregar otra categoría/i));

    expect(screen.getByText("Agregar Categoría")).toBeInTheDocument();
  });

  it("submits create form with correct data", async () => {
    mockCreateCategory.mockResolvedValue({
      status: 201,
      data: { category: { id: "c3", name: "plomería", path: "plomeria" } },
    });

    render(<Categories />);
    const user = userEvent.setup();

    await waitFor(() => expect(mockGetCategories).toHaveBeenCalled());

    await user.click(screen.getByText(/Agregar otra categoría/i));
    await user.type(screen.getByLabelText("Nombre"), "Plomería");
    await user.click(screen.getByRole("button", { name: "Agregar" }));

    await waitFor(() => {
      expect(mockCreateCategory).toHaveBeenCalledWith({ name: "Plomería" });
    });
  });

  it("handles 409 conflict on create", async () => {
    mockCreateCategory.mockRejectedValue({ response: { status: 409 } });

    render(<Categories />);
    const user = userEvent.setup();

    await waitFor(() => expect(mockGetCategories).toHaveBeenCalled());

    await user.click(screen.getByText(/Agregar otra categoría/i));
    await user.type(screen.getByLabelText("Nombre"), "Herramientas");
    await user.click(screen.getByRole("button", { name: "Agregar" }));

    await waitFor(() => {
      expect(mockCreateCategory).toHaveBeenCalled();
    });
  });
});
