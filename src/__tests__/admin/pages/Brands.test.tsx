import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("notistack", () => ({
  useSnackbar: () => ({ enqueueSnackbar: vi.fn() }),
}));

vi.mock("next/image", () => ({
  default: (props: any) => <img {...props} />,
}));

// Mock CrudAdminTable to avoid DataGrid CSS issues in jsdom
vi.mock("@/components/CrudAdminTable", () => ({
  default: ({ title, handleClick, rows, onEditClick }: any) => (
    <div data-testid="crud-table">
      <button onClick={handleClick}>Agregar otra {title}</button>
      <ul>
        {rows.map((r: any) => (
          <li key={r.id}>
            {r.name}
            <button onClick={() => onEditClick(r)}>Editar {r.name}</button>
          </li>
        ))}
      </ul>
    </div>
  ),
}));

const mockGetBrands = vi.fn();
const mockCreateBrand = vi.fn();
const mockUpdateBrand = vi.fn();

vi.mock("@/api/admin/brands", () => ({
  getBrands: (...args: unknown[]) => mockGetBrands(...args),
  createBrand: (...args: unknown[]) => mockCreateBrand(...args),
  updateBrand: (...args: unknown[]) => mockUpdateBrand(...args),
}));

vi.mock("@/actions/revalidate", () => ({
  revalidateBrandPage: vi.fn(),
}));

import Brands from "@/app/(admin)/admin/brands/Brands";

const sampleBrands = [
  { id: "b1", name: "dewalt", codeName: "dewalt", File: { path: "/dewalt.png" } },
  { id: "b2", name: "makita", codeName: "makita", File: { path: "/makita.png" } },
];

beforeEach(() => {
  vi.clearAllMocks();
  mockGetBrands.mockResolvedValue({ brands: sampleBrands, count: 2 });
});

describe("Brands page", () => {
  it("fetches brands on mount", async () => {
    render(<Brands />);

    await waitFor(() => {
      expect(mockGetBrands).toHaveBeenCalledWith({ page: 1, size: 10 });
    });
  });

  it("renders fetched brands", async () => {
    render(<Brands />);

    await waitFor(() => {
      expect(screen.getByText("dewalt")).toBeInTheDocument();
      expect(screen.getByText("makita")).toBeInTheDocument();
    });
  });

  it("opens add modal when clicking add button", async () => {
    render(<Brands />);
    const user = userEvent.setup();

    await waitFor(() => expect(mockGetBrands).toHaveBeenCalled());

    await user.click(screen.getByText("Agregar otra marca"));

    expect(screen.getByText("Agregar Marca")).toBeInTheDocument();
  });

  it("opens edit modal when clicking edit button", async () => {
    render(<Brands />);
    const user = userEvent.setup();

    await waitFor(() => expect(screen.getByText("dewalt")).toBeInTheDocument());

    await user.click(screen.getByText("Editar dewalt"));

    expect(screen.getByText("Editar Marca")).toBeInTheDocument();
  });

  it("creates a brand with FormData on submit", async () => {
    mockCreateBrand.mockResolvedValue({
      status: 201,
      data: {
        brand: { id: "b3", name: "Bosch", codeName: "bosch" },
        file: { path: "/bosch.png" },
      },
    });

    render(<Brands />);
    const user = userEvent.setup();

    await waitFor(() => expect(mockGetBrands).toHaveBeenCalled());

    await user.click(screen.getByText("Agregar otra marca"));
    await user.type(screen.getByLabelText("Nombre"), "Bosch");

    expect(screen.getByLabelText("Nombre")).toHaveValue("Bosch");
  });
});
