import type { Trip } from "../../src/types/Trip";
import { extendTripDates } from "../../src/utils/tripDates";

const trip: Trip = {
  id: "trip-1",
  name: "Italy",
  startDate: "2026-06-01",
  endDate: "2026-06-10",
};

test("keeps trip dates unchanged when the step is within the trip", () => {
  const result = extendTripDates({ ...trip }, "2026-06-05");

  expect(result).toEqual(trip);
});

test("extends the trip start for an earlier step", () => {
  const result = extendTripDates({ ...trip }, "2026-05-30");

  expect(result).toEqual({
    ...trip,
    startDate: "2026-05-30",
  });
});

test("extends the trip end for a later step", () => {
  const result = extendTripDates({ ...trip }, "2026-06-12");

  expect(result).toEqual({
    ...trip,
    endDate: "2026-06-12",
  });
});
