import { describe, expect, it } from "vitest";
import { rowsToCsv } from "@/lib/csv";

describe("CSV export", () => {
  it("quotes delimiters, escapes quotes, and names null values", () => {
    const csv = rowsToCsv([["Beer", "Note"], ["Lantern, Quadrupel", 'Says "hello"'], ["Unknown", null]]);
    expect(csv).toContain('"Lantern, Quadrupel","Says ""hello"""');
    expect(csv).toContain('"Unknown","Not reported"');
    expect(csv.startsWith("\uFEFF")).toBe(true);
  });
});
