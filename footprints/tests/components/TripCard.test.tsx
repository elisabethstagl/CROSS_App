import React from "react";
import { fireEvent, render } from "@testing-library/react-native";

import { TripCard } from "../../src/components/TripCard";
import type { Trip } from "../../src/types/Trip";
import type { Step } from "../../src/types/Step";

let mockSteps: Step[] = [];

jest.mock("@/hooks/use-theme", () => ({
  useTheme: () => ({
    text: "#242824",
    textSecondary: "#68736C",
    surface: "#FFFFFF",
    surfaceVariant: "#F1F3EF",
    primary: "#3F6654",
    primaryContainer: "#D9E6DE",
    onPrimaryContainer: "#173729",
    outline: "#D9DDD8",
    error: "#B94A48",
  }),
}));

jest.mock("@/store/tripStore", () => ({
  useTripStore: (selector: any) => selector({ steps: mockSteps }),
}));

jest.mock("@react-native-vector-icons/material-icons", () => {
  const { View } = require("react-native");

  return {
    MaterialIcons: () => <View />,
  };
});

jest.mock("expo-image", () => {
  const { View } = require("react-native");

  return {
    Image: (props: any) => (
      <View testID="trip-cover" accessibilityLabel={props.accessibilityLabel} />
    ),
  };
});

const exampleTrip: Trip = {
  id: "trip-1",
  name: "Italy",
  startDate: "2026-06-01",
  endDate: "2026-06-10",
};

const exampleStep: Step = {
  id: "step-1",
  tripId: "trip-1",
  name: "Rome",
  note: "",
  date: "2026-06-02",
  photoUri: "file:///rome.jpg",
};

async function setup(trip: Trip = exampleTrip) {
  const onPress = jest.fn();
  const onEdit = jest.fn();
  const onDelete = jest.fn();

  const queries = await render(
    <TripCard
      trip={trip}
      onPress={onPress}
      onEdit={onEdit}
      onDelete={onDelete}
    />,
  );

  return {
    ...queries,
    onPress,
    onEdit,
    onDelete,
  };
}

describe("TripCard", () => {
  beforeEach(() => {
    mockSteps = [];
  });

  test("displays the trip name", async () => {
    const { getByText } = await setup();

    expect(getByText("Italy")).toBeTruthy();
  });

  test("displays the trip date range", async () => {
    const { getByText } = await setup();

    expect(getByText("01.06.2026 – 10.06.2026")).toBeTruthy();
  });

  test("shows a placeholder when no photo exists", async () => {
    const { getByText, queryByTestId } = await setup();

    expect(getByText("Your next adventure")).toBeTruthy();

    expect(queryByTestId("trip-cover")).toBeNull();
  });

  test("shows a cover photo from a step", async () => {
    mockSteps = [exampleStep];

    const { getByLabelText } = await setup();

    expect(getByLabelText("Cover photo for Italy")).toBeTruthy();
  });

  test("ignores photos from another trip", async () => {
    mockSteps = [
      {
        ...exampleStep,
        tripId: "trip-2",
      },
    ];

    const { queryByTestId } = await setup();

    expect(queryByTestId("trip-cover")).toBeNull();
  });

  test("skips steps without photos", async () => {
    mockSteps = [
      {
        ...exampleStep,
        photoUri: undefined,
      },
      {
        ...exampleStep,
        id: "step-2",
        name: "Florence",
        photoUri: "file:///florence.jpg",
      },
    ];

    const { getByLabelText } = await setup();

    expect(getByLabelText("Cover photo for Italy")).toBeTruthy();
  });

  test("displays zero steps", async () => {
    const { getByText } = await setup();

    expect(getByText("0 steps")).toBeTruthy();
  });

  test("displays the singular step count", async () => {
    mockSteps = [exampleStep];

    const { getByText } = await setup();

    expect(getByText("1 step")).toBeTruthy();
  });

  test("displays multiple steps", async () => {
    mockSteps = [
      exampleStep,
      {
        ...exampleStep,
        id: "step-2",
        name: "Florence",
      },
    ];

    const { getByText } = await setup();

    expect(getByText("2 steps")).toBeTruthy();
  });

  test("counts only steps belonging to this trip", async () => {
    mockSteps = [
      exampleStep,
      {
        ...exampleStep,
        id: "step-2",
        tripId: "trip-2",
      },
    ];

    const { getByText } = await setup();

    expect(getByText("1 step")).toBeTruthy();
  });

  test("opens the trip when pressed", async () => {
    const { getByLabelText, onPress } = await setup();

    fireEvent.press(getByLabelText("Open trip Italy"));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test("edits without opening the trip", async () => {
    const { getByLabelText, onEdit, onPress } = await setup();

    fireEvent.press(getByLabelText("Edit Italy"));

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onPress).not.toHaveBeenCalled();
  });

  test("deletes without opening the trip", async () => {
    const { getByLabelText, onDelete, onPress } = await setup();

    fireEvent.press(getByLabelText("Delete Italy"));

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onPress).not.toHaveBeenCalled();
  });

  test("does not delete when edit is pressed", async () => {
    const { getByLabelText, onEdit, onDelete } = await setup();

    fireEvent.press(getByLabelText("Edit Italy"));

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onDelete).not.toHaveBeenCalled();
  });
});
