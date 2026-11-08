import { isValidDate, formatDisplayDate, toStorageDate } from "@/utils/date";

describe("Date utilities", () => {
  describe("isValidDate", () => {
    test("accepts a valid date", () => {
      expect(isValidDate("2026-11-08")).toBe(true);
    });

    test("accepts leap day in a leap year", () => {
      expect(isValidDate("2024-02-29")).toBe(true);
    });

    test("rejects leap day in a non-leap year", () => {
      expect(isValidDate("2025-02-29")).toBe(false);
    });

    test("rejects an invalid month", () => {
      expect(isValidDate("2026-13-08")).toBe(false);
    });

    test("rejects an invalid day", () => {
      expect(isValidDate("2026-04-31")).toBe(false);
    });

    test("rejects an incorrect date format", () => {
      expect(isValidDate("08.11.2026")).toBe(false);
    });

    test("rejects an empty string", () => {
      expect(isValidDate("")).toBe(false);
    });
  });

  describe("formatDisplayDate", () => {
    test("formats a stored date for display", () => {
      expect(formatDisplayDate("2026-11-08")).toBe("08.11.2026");
    });

    test("returns a placeholder for an empty date", () => {
      expect(formatDisplayDate("")).toBe("TT.MM.JJJJ");
    });
  });

  describe("toStorageDate", () => {
    test("converts a Date to YYYY-MM-DD", () => {
      const date = new Date(2026, 10, 8);

      expect(toStorageDate(date)).toBe("2026-11-08");
    });

    test("adds leading zeros", () => {
      const date = new Date(2026, 0, 5);

      expect(toStorageDate(date)).toBe("2026-01-05");
    });
  });
});
