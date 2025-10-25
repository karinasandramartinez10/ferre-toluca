export const openPrintWindow = (
  htmlString,
  { title = "Documento", width = 1100, height = 800, top = 80, left = 80 } = {}
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

export const buildTableHtml = ({
  caption,
  headers = [],
  rows = [],
  styles = `body{font-family:Arial,Helvetica,sans-serif;padding:16px;color:#000}
            h2{margin:0 0 12px 0}
            table{width:100%;border-collapse:collapse}
            th,td{border:1px solid #ddd;padding:6px;text-align:left;font-size:12px}
            th{background:#f5f5f5}`,
} = {}) => {
  const thead = `<thead><tr>${headers
    .map((h) => `<th>${h}</th>`)
    .join("")}</tr></thead>`;
  const tbody = `<tbody>${rows.join("")}</tbody>`;
  const captionHtml = caption ? `<h2>${caption}</h2>` : "";
  return `
    <style>${styles}</style>
    ${captionHtml}
    <table>${thead}${tbody}</table>
  `;
};
