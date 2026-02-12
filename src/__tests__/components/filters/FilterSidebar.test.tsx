import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FilterSidebar from "../../../components/filters/FilterSidebar";

const defaultOptions = {
  brands: [
    { id: 1, name: "truper", count: 10 },
    { id: 2, name: "stanley", count: 5 },
  ],
  categories: [{ id: 3, name: "herramientas", count: 15 }],
  subcategories: [{ id: 4, name: "llaves", count: 7 }],
  types: [],
  models: [],
  measures: [],
  designs: [],
};

describe("FilterSidebar", () => {
  it("renders filter sections for available options", () => {
    render(
      <FilterSidebar
        options={defaultOptions}
        selectedFilters={{}}
        fixedFilters={{}}
        onToggle={() => {}}
        onClear={() => {}}
        hasActiveFilters={false}
      />
    );

    expect(screen.getByText("Filtros")).toBeInTheDocument();
    expect(screen.getByText("Marca")).toBeInTheDocument();
    expect(screen.getByText("Categoría")).toBeInTheDocument();
    expect(screen.getByText("Subcategoría")).toBeInTheDocument();
  });

  it("hides sections that correspond to fixed filters", () => {
    render(
      <FilterSidebar
        options={defaultOptions}
        selectedFilters={{}}
        fixedFilters={{ brandIds: [1] }}
        onToggle={() => {}}
        onClear={() => {}}
        hasActiveFilters={false}
      />
    );

    expect(screen.queryByText("Marca")).not.toBeInTheDocument();
    expect(screen.getByText("Categoría")).toBeInTheDocument();
  });

  it("shows clear button when hasActiveFilters", () => {
    render(
      <FilterSidebar
        options={defaultOptions}
        selectedFilters={{ brandIds: [1] }}
        fixedFilters={{}}
        onToggle={() => {}}
        onClear={() => {}}
        hasActiveFilters
      />
    );

    expect(screen.getByText("Limpiar")).toBeInTheDocument();
  });

  it("does not show clear button when no active filters", () => {
    render(
      <FilterSidebar
        options={defaultOptions}
        selectedFilters={{}}
        fixedFilters={{}}
        onToggle={() => {}}
        onClear={() => {}}
        hasActiveFilters={false}
      />
    );

    expect(screen.queryByText("Limpiar")).not.toBeInTheDocument();
  });

  it("calls onClear when clear button is clicked", async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();

    render(
      <FilterSidebar
        options={defaultOptions}
        selectedFilters={{ brandIds: [1] }}
        fixedFilters={{}}
        onToggle={() => {}}
        onClear={onClear}
        hasActiveFilters
      />
    );

    await user.click(screen.getByText("Limpiar"));
    expect(onClear).toHaveBeenCalledOnce();
  });

  it("renders skeleton when loading", () => {
    const { container } = render(
      <FilterSidebar
        options={{}}
        selectedFilters={{}}
        fixedFilters={{}}
        onToggle={() => {}}
        onClear={() => {}}
        hasActiveFilters={false}
        loading
      />
    );

    // MUI Skeleton renders spans with specific classes
    const skeletons = container.querySelectorAll(".MuiSkeleton-root");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("does not render empty sections", () => {
    render(
      <FilterSidebar
        options={{ ...defaultOptions, types: [], models: [] }}
        selectedFilters={{}}
        fixedFilters={{}}
        onToggle={() => {}}
        onClear={() => {}}
        hasActiveFilters={false}
      />
    );

    expect(screen.queryByText("Tipo")).not.toBeInTheDocument();
    expect(screen.queryByText("Modelo")).not.toBeInTheDocument();
  });
});
