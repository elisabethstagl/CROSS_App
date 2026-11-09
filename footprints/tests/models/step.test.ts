import type { Step } from "../../src/types/Step";

describe("Step data model", () => {
  const step: Step = {
    id: "step-1",
    tripId: "trip-1",
    name: "Colosseum",
    note: "Visited the Colosseum in Rome.",
    date: "2026-06-02",
    latitude: 41.8902,
    longitude: 12.4922,
    photoUri: "file:///colosseum.jpg",
  };

  test("stores the step name", () => {
    expect(step.name).toBe("Colosseum");
  });

  test("references the correct trip", () => {
    expect(step.tripId).toBe("trip-1");
  });

  test("stores a note", () => {
    expect(step.note).toBe("Visited the Colosseum in Rome.");
  });

  test("stores the date", () => {
    expect(step.date).toBe("2026-06-02");
  });

  test("stores GPS coordinates", () => {
    expect(step.latitude).toBe(41.8902);
    expect(step.longitude).toBe(12.4922);
  });

  test("stores a photo URI", () => {
    expect(step.photoUri).toBe("file:///colosseum.jpg");
  });

  test("allows a step without GPS or a photo", () => {
    const simpleStep: Step = {
      id: "step-2",
      tripId: "trip-1",
      name: "Dinner",
      note: "Pizza!",
      date: "2026-06-03",
    };

    expect(simpleStep.latitude).toBeUndefined();
    expect(simpleStep.longitude).toBeUndefined();
    expect(simpleStep.photoUri).toBeUndefined();
  });
});
