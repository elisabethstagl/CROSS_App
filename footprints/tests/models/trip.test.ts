import type { Trip } from "../../src/types/Trip";

describe("Trip data model", () => {
  const trip: Trip = {
    id: "trip-1",
    name: "Italy",
    startDate: "2026-06-01",
    endDate: "2026-06-10",
  };

  test("stores the trip name", () => {
    expect(trip.name).toBe("Italy");
  });

  test("stores a unique trip ID", () => {
    expect(trip.id).toBe("trip-1");
  });

  test("stores the start and end dates", () => {
    expect(trip.startDate).toBe("2026-06-01");
    expect(trip.endDate).toBe("2026-06-10");
  });

  test("allows creating another trip", () => {
    const anotherTrip: Trip = {
      id: "trip-2",
      name: "France",
      startDate: "2026-07-01",
      endDate: "2026-07-05",
    };

    expect(anotherTrip.name).toBe("France");
    expect(anotherTrip.id).not.toBe(trip.id);
  });
});
