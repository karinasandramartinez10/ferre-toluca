interface PrintWindowOptions {
  title?: string;
  width?: number;
  height?: number;
  top?: number;
  left?: number;
}

export const openPrintWindow = (
  htmlString: string,
  { title = "Documento", width = 1100, height = 800, top = 80, left = 80 }: PrintWindowOptions = {}
) => {
  if (typeof window === "undefined") return;
  const features = `height=${height},width=${width},top=${top},left=${left}`;
  const w = window.open("", "PRINT", features);
  if (!w) return;
  const doc = `<!doctype html><html lang="es"><head><meta charset="utf-8"/><title>${title}</title></head><body>${htmlString}</body></html>`;
  w.document.open();
  w.document.write(doc);
  w.document.close();
  w.focus();
  setTimeout(() => {
    try {
      w.print();
    } catch {}
    try {
      w.close();
    } catch {}
  }, 100);
};

export const escapeHtml = (value: unknown): string => {
  const str = String(value ?? "");
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

interface BuildTableHtmlOptions {
  caption?: string;
  headers?: string[];
  rows?: string[];
  styles?: string;
}

export const buildTableHtml = ({
  caption,
  headers = [],
  rows = [],
  styles = `body{font-family:Arial,Helvetica,sans-serif;padding:16px;color:#000}
            h2{margin:0 0 12px 0}
            table{width:100%;border-collapse:collapse}
            th,td{border:1px solid #ddd;padding:6px;text-align:left;font-size:12px}
            th{background:#f5f5f5}`,
}: BuildTableHtmlOptions = {}) => {
  const thead = `<thead><tr>${headers.map((h) => `<th>${escapeHtml(h)}</th>`).join("")}</tr></thead>`;
  const tbody = `<tbody>${rows.join("")}</tbody>`;
  const captionHtml = caption ? `<h2>${escapeHtml(caption)}</h2>` : "";
  return `
    <style>${styles}</style>
    ${captionHtml}
    <table>${thead}${tbody}</table>
  `;
};
