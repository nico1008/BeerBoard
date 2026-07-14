export function csvCell(value: string | number | null | undefined) {
  const text = value === null || value === undefined ? "Not reported" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

export function rowsToCsv(rows: Array<Array<string | number | null | undefined>>) {
  return `\uFEFF${rows.map((row) => row.map(csvCell).join(",")).join("\r\n")}`;
}
