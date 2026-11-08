import {
  formatDisplayDate,
  isValidDate,
  toStorageDate,
} from "../../src/utils/date";
import { sortByDate } from "../../src/utils/sortByDate";

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

    test("rejects February 30", () => {
      expect(isValidDate("2026-02-30")).toBe(false);
    });

    test("rejects April 31", () => {
      expect(isValidDate("2026-04-31")).toBe(false);
    });

    test("rejects an invalid month", () => {
      expect(isValidDate("2026-13-08")).toBe(false);
    });

    test("rejects month zero", () => {
      expect(isValidDate("2026-00-08")).toBe(false);
    });

    test("rejects day zero", () => {
      expect(isValidDate("2026-06-00")).toBe(false);
    });

    test("rejects an incorrect date format", () => {
      expect(isValidDate("08.11.2026")).toBe(false);
    });

    test("rejects dates without leading zeros", () => {
      expect(isValidDate("2026-6-8")).toBe(false);
    });

    test("rejects whitespace around a date", () => {
      expect(isValidDate(" 2026-11-08 ")).toBe(false);
    });

    test("rejects an empty string", () => {
      expect(isValidDate("")).toBe(false);
    });

    test("accepts the last day of December", () => {
      expect(isValidDate("2026-12-31")).toBe(true);
    });
  });

  describe("formatDisplayDate", () => {
    test("formats a stored date for display", () => {
      expect(formatDisplayDate("2026-11-08")).toBe("08.11.2026");
    });

    test("adds no extra characters", () => {
      expect(formatDisplayDate("2026-01-05")).toBe("05.01.2026");
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

    test("adds leading zeros to month and day", () => {
      const date = new Date(2026, 0, 5);

      expect(toStorageDate(date)).toBe("2026-01-05");
    });

    test("handles leap day", () => {
      const date = new Date(2024, 1, 29);

      expect(toStorageDate(date)).toBe("2024-02-29");
    });
  });

  describe("sortByDate", () => {
    test("sorts newest dates first and equal dates by ID", () => {
      const items = [
        { id: "b", date: "2026-06-01" },
        { id: "c", date: "2026-07-01" },
        { id: "a", date: "2026-06-01" },
      ];

      const result = sortByDate(items, (item) => item.date);

      expect(result.map((item) => item.id)).toEqual(["c", "a", "b"]);
    });
  });
});
