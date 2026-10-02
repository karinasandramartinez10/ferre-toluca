import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SnackbarProvider } from "notistack";
import Products from "../../../app/(admin)/admin/products/Products";
import { fetchAllProducts, searchAllProducts } from "../../../api/products";
import { ADMIN_PAGE_SIZE } from "../../../constants/x-datagrid/pagination";

vi.mock("../../../api/products", () => ({
  fetchAllProducts: vi.fn().mockResolvedValue({ products: [], count: 0 }),
  searchAllProducts: vi.fn().mockResolvedValue({ products: [], count: 0 }),
}));

vi.mock("../../../hooks/admin/useUpdateProduct", () => ({
  useUpdateProduct: () => ({ update: vi.fn(), saving: false }),
}));

const renderPage = () =>
  render(
    <SnackbarProvider>
      <Products />
    </SnackbarProvider>
  );

const typeSearch = async (user, text: string) => {
  await user.type(screen.getByPlaceholderText(/Buscar por nombre/i), text);
};

describe("Products: búsqueda server-side", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(fetchAllProducts).mockResolvedValue({ products: [], count: 0 });
    vi.mocked(searchAllProducts).mockResolvedValue({ products: [], count: 0 });
  });

  it("carga la primera página con el tamaño máximo", async () => {
    renderPage();
    await waitFor(() => expect(fetchAllProducts).toHaveBeenCalledWith(1, ADMIN_PAGE_SIZE));
    expect(searchAllProducts).not.toHaveBeenCalled();
  });

  it("no busca con menos de 3 caracteres", async () => {
    const user = userEvent.setup();
    renderPage();
    await waitFor(() => expect(fetchAllProducts).toHaveBeenCalled());

    await typeSearch(user, "ta");

    await waitFor(() => expect(searchAllProducts).not.toHaveBeenCalled(), { timeout: 1000 });
  });

  it("pega al backend al escribir 3 o más caracteres", async () => {
    const user = userEvent.setup();
    renderPage();
    await waitFor(() => expect(fetchAllProducts).toHaveBeenCalled());

    await typeSearch(user, "taladro");

    await waitFor(
      () => expect(searchAllProducts).toHaveBeenCalledWith(1, ADMIN_PAGE_SIZE, "taladro"),
      {
        timeout: 3000,
      }
    );
  });

  it("vuelve al listado completo al limpiar la búsqueda", async () => {
    const user = userEvent.setup();
    renderPage();
    await waitFor(() => expect(fetchAllProducts).toHaveBeenCalled());
    await typeSearch(user, "taladro");
    await waitFor(() => expect(searchAllProducts).toHaveBeenCalled(), { timeout: 3000 });

    vi.mocked(fetchAllProducts).mockClear();
    await user.click(screen.getByLabelText("Limpiar búsqueda"));

    await waitFor(() => expect(fetchAllProducts).toHaveBeenCalledWith(1, ADMIN_PAGE_SIZE), {
      timeout: 3000,
    });
  });

  it("mantiene el grid y el campo montados mientras carga, sin tapar la página", async () => {
    // La carga se deja pendiente a propósito: si la página volviera a hacer
    // early-return con un spinner, el input se desmontaría y perdería el foco
    // en cada tecleo, y el LCP quedaría encadenado a la respuesta del backend.
    let resolveSearch: (value: unknown) => void = () => {};
    vi.mocked(searchAllProducts).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveSearch = resolve;
        })
    );

    const user = userEvent.setup();
    renderPage();
    await waitFor(() => expect(fetchAllProducts).toHaveBeenCalled());

    await typeSearch(user, "taladro");
    await waitFor(() => expect(searchAllProducts).toHaveBeenCalled(), { timeout: 3000 });

    const input = screen.getByPlaceholderText(/Buscar por nombre/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveFocus();
    expect(screen.getByRole("grid")).toBeInTheDocument();

    resolveSearch({ products: [], count: 0 });
    await waitFor(() => expect(input).toBeInTheDocument());
  });

  it("expone un único buscador, sin el quick filter de MUI", async () => {
    renderPage();
    await waitFor(() => expect(fetchAllProducts).toHaveBeenCalled());

    expect(screen.getAllByRole("textbox")).toHaveLength(1);
    expect(screen.queryByPlaceholderText("Buscar...")).toBeNull();
    expect(screen.getByPlaceholderText(/Buscar por nombre/i)).toBeInTheDocument();
  });
});
