import { describe, it, expect } from "vitest";
import { buildTableHtml } from "../../utils/print";

describe("buildTableHtml", () => {
  it("builds a table with headers and rows", () => {
    const html = buildTableHtml({
      caption: "Mi Tabla",
      headers: ["Col1", "Col2"],
      rows: ["<tr><td>A</td><td>B</td></tr>"],
    });
    expect(html).toContain("<h2>Mi Tabla</h2>");
    expect(html).toContain("<th>Col1</th>");
    expect(html).toContain("<th>Col2</th>");
    expect(html).toContain("<tr><td>A</td><td>B</td></tr>");
    expect(html).toContain("<style>");
  });

  it("omits caption when not provided", () => {
    const html = buildTableHtml({ headers: ["A"], rows: [] });
    expect(html).not.toContain("<h2>");
  });

  it("renders with defaults when no args", () => {
    const html = buildTableHtml();
    expect(html).toContain("<thead>");
    expect(html).toContain("<tbody>");
  });

  it("handles empty headers and rows", () => {
    const html = buildTableHtml({ headers: [], rows: [] });
    expect(html).toContain("<thead><tr></tr></thead>");
    expect(html).toContain("<tbody></tbody>");
  });
});
