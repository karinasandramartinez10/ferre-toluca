import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BrandModal from "../../../app/(admin)/admin/brands/BrandModal";

vi.mock("notistack", () => ({
  useSnackbar: () => ({ enqueueSnackbar: vi.fn() }),
}));

const defaultProps = {
  open: true,
  onClose: vi.fn(),
  onSubmit: vi.fn(),
  loading: false,
  mode: "create" as const,
  selectedBrand: null,
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("BrandModal", () => {
  it("renders create mode title", () => {
    render(<BrandModal {...defaultProps} />);
    expect(screen.getByText("Agregar Marca")).toBeInTheDocument();
  });

  it("renders edit mode title", () => {
    render(
      <BrandModal
        {...defaultProps}
        mode="edit"
        selectedBrand={{ id: "b1", name: "MarcaX", File: { path: "/img.png" } } as any}
      />
    );
    expect(screen.getByText("Editar Marca")).toBeInTheDocument();
  });

  it("pre-fills name in edit mode", async () => {
    render(
      <BrandModal
        {...defaultProps}
        mode="edit"
        selectedBrand={{ id: "b1", name: "MarcaX" } as any}
      />
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Nombre")).toHaveValue("MarcaX");
    });
  });

  it("shows the name input field", () => {
    render(<BrandModal {...defaultProps} />);
    expect(screen.getByLabelText("Nombre")).toBeInTheDocument();
  });

  it("cancel button calls onClose", async () => {
    render(<BrandModal {...defaultProps} />);
    await userEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("shows 'Agregar' button in create mode", () => {
    render(<BrandModal {...defaultProps} />);
    expect(screen.getByRole("button", { name: "Agregar" })).toBeInTheDocument();
  });

  it("shows 'Guardar Cambios' button in edit mode", () => {
    render(
      <BrandModal {...defaultProps} mode="edit" selectedBrand={{ id: "b1", name: "Test" } as any} />
    );
    expect(screen.getByRole("button", { name: "Guardar Cambios" })).toBeInTheDocument();
  });

  it("does not render when open is false", () => {
    const { container } = render(<BrandModal {...defaultProps} open={false} />);
    expect(container.querySelector("[role='dialog']")).not.toBeInTheDocument();
  });
});
