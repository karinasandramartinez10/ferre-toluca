import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ActionModal from "../../../components/ActionModal";

// Minimal mock for notistack
vi.mock("notistack", () => ({
  useSnackbar: () => ({ enqueueSnackbar: vi.fn() }),
}));

const defaultProps = {
  title: "Categoría",
  open: true,
  onClose: vi.fn(),
  onSubmit: vi.fn(),
  loading: false,
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("ActionModal", () => {
  it("renders create mode title by default", () => {
    render(<ActionModal {...defaultProps} />);
    expect(screen.getByText("Agregar Categoría")).toBeInTheDocument();
  });

  it("renders edit mode title", () => {
    render(<ActionModal {...defaultProps} mode="edit" selected={{ name: "Test" }} />);
    expect(screen.getByText("Editar Categoría")).toBeInTheDocument();
  });

  it("shows the name input field", () => {
    render(<ActionModal {...defaultProps} />);
    expect(screen.getByLabelText("Nombre")).toBeInTheDocument();
  });

  it("pre-fills name in edit mode", async () => {
    render(<ActionModal {...defaultProps} mode="edit" selected={{ name: "Herramientas" }} />);

    await waitFor(() => {
      expect(screen.getByLabelText("Nombre")).toHaveValue("Herramientas");
    });
  });

  it("submit button shows 'Agregar' in create mode", () => {
    render(<ActionModal {...defaultProps} />);
    expect(screen.getByRole("button", { name: "Agregar" })).toBeInTheDocument();
  });

  it("submit button shows 'Guardar Cambios' in edit mode", () => {
    render(<ActionModal {...defaultProps} mode="edit" selected={{ name: "X" }} />);
    expect(screen.getByRole("button", { name: "Guardar Cambios" })).toBeInTheDocument();
  });

  it("submit button is disabled when loading", () => {
    render(<ActionModal {...defaultProps} loading={true} />);
    expect(screen.getByRole("button", { name: "Agregar" })).toBeDisabled();
  });

  it("cancel button calls onClose", async () => {
    render(<ActionModal {...defaultProps} />);
    await userEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("calls onSubmit with correct data when form is valid", async () => {
    render(<ActionModal {...defaultProps} />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText("Nombre"), "Nueva Categoría");

    const form = screen.getByLabelText("Nombre").closest("form")!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(defaultProps.onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Nueva Categoría" })
      );
    });
  });

  it("does not render when open is false", () => {
    const { container } = render(<ActionModal {...defaultProps} open={false} />);
    expect(container.querySelector("[role='dialog']")).not.toBeInTheDocument();
  });
});
