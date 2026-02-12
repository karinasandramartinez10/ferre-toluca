import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FilterSection from "../../../components/filters/FilterSection";

const baseOptions = [
  { id: 1, name: "truper", count: 10 },
  { id: 2, name: "stanley", count: 5 },
  { id: 3, name: "dewalt", count: 8 },
];

describe("FilterSection", () => {
  it("renders the title and options", () => {
    render(
      <FilterSection title="Marca" options={baseOptions} selectedIds={[]} onToggle={() => {}} />
    );

    expect(screen.getByText("Marca")).toBeInTheDocument();
    expect(screen.getByText(/Truper/)).toBeInTheDocument();
    expect(screen.getByText(/Stanley/)).toBeInTheDocument();
    expect(screen.getByText(/Dewalt/)).toBeInTheDocument();
  });

  it("shows count next to option name", () => {
    render(
      <FilterSection title="Marca" options={baseOptions} selectedIds={[]} onToggle={() => {}} />
    );

    expect(screen.getByText("(10)")).toBeInTheDocument();
    expect(screen.getByText("(5)")).toBeInTheDocument();
  });

  it("checks selected options", () => {
    render(
      <FilterSection title="Marca" options={baseOptions} selectedIds={[1]} onToggle={() => {}} />
    );

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
  });

  it("calls onToggle when checkbox is clicked", async () => {
    const onToggle = vi.fn();
    const user = userEvent.setup();

    render(
      <FilterSection title="Marca" options={baseOptions} selectedIds={[]} onToggle={onToggle} />
    );

    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[0]);

    expect(onToggle).toHaveBeenCalledWith(1);
  });

  it("shows selected count badge", () => {
    render(
      <FilterSection title="Marca" options={baseOptions} selectedIds={[1, 2]} onToggle={() => {}} />
    );

    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("renders nothing when options are empty", () => {
    const { container } = render(
      <FilterSection title="Marca" options={[]} selectedIds={[]} onToggle={() => {}} />
    );

    expect(container.innerHTML).toBe("");
  });

  it("shows search field when showSearch is true and >5 options", () => {
    const manyOptions = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      name: `option ${i}`,
      count: i,
    }));

    render(
      <FilterSection
        title="Marca"
        options={manyOptions}
        selectedIds={[]}
        onToggle={() => {}}
        showSearch
      />
    );

    expect(screen.getByPlaceholderText("Buscar...")).toBeInTheDocument();
  });

  it("filters options by search term", async () => {
    const user = userEvent.setup();
    const manyOptions = [
      { id: 1, name: "truper", count: 10 },
      { id: 2, name: "stanley", count: 5 },
      { id: 3, name: "dewalt", count: 8 },
      { id: 4, name: "bosch", count: 3 },
      { id: 5, name: "makita", count: 7 },
      { id: 6, name: "milwaukee", count: 4 },
    ];

    render(
      <FilterSection
        title="Marca"
        options={manyOptions}
        selectedIds={[]}
        onToggle={() => {}}
        showSearch
      />
    );

    const searchInput = screen.getByPlaceholderText("Buscar...");
    await user.type(searchInput, "tru");

    expect(screen.getByText(/Truper/)).toBeInTheDocument();
    expect(screen.queryByText(/Stanley/)).not.toBeInTheDocument();
  });

  it("shows no results message when search finds nothing", async () => {
    const user = userEvent.setup();
    const manyOptions = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      name: `option ${i}`,
      count: i,
    }));

    render(
      <FilterSection
        title="Marca"
        options={manyOptions}
        selectedIds={[]}
        onToggle={() => {}}
        showSearch
      />
    );

    const searchInput = screen.getByPlaceholderText("Buscar...");
    await user.type(searchInput, "xyz");

    expect(screen.getByText("No se encontraron resultados")).toBeInTheDocument();
  });
});
