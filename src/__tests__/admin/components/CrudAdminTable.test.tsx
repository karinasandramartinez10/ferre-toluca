import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CrudAdminTable from "../../../components/CrudAdminTable";

const defaultProps = {
  rows: [{ id: "1", name: "Item 1" }],
  columns: [{ field: "name", headerName: "Nombre", width: 200 }],
  onEditClick: vi.fn(),
  paginationModel: { page: 0, pageSize: 10 },
  onPaginationModelChange: vi.fn(),
  rowCount: 1,
  title: "marca",
  handleClick: vi.fn(),
};

describe("CrudAdminTable", () => {
  it("renders the add button with the correct title", () => {
    render(<CrudAdminTable {...defaultProps} />);
    expect(screen.getByText("Agregar otra marca")).toBeInTheDocument();
  });

  it("calls handleClick when add button is clicked", async () => {
    render(<CrudAdminTable {...defaultProps} />);
    const user = userEvent.setup();
    await user.click(screen.getByText("Agregar otra marca"));
    expect(defaultProps.handleClick).toHaveBeenCalled();
  });

  it("renders the name column data", () => {
    render(<CrudAdminTable {...defaultProps} />);
    expect(screen.getByText("Item 1")).toBeInTheDocument();
  });

  it("renders the actions column header", () => {
    render(<CrudAdminTable {...defaultProps} />);
    expect(screen.getByText("Acciones")).toBeInTheDocument();
  });
});
