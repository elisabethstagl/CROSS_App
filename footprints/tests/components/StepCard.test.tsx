import React from "react";
import { fireEvent, render } from "@testing-library/react-native";

import { StepCard } from "../../src/components/StepCard";
import type { Step } from "../../src/types/Step";

jest.mock("@/hooks/use-theme", () => ({
  useTheme: () => ({
    text: "#242824",
    textSecondary: "#68736C",
    surface: "#FFFFFF",
    surfaceVariant: "#F1F3EF",
    error: "#B94A48",
  }),
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
      <View testID="step-photo" accessibilityLabel={props.accessibilityLabel} />
    ),
  };
});

const exampleStep: Step = {
  id: "step-1",
  tripId: "trip-1",
  name: "Colosseum",
  note: "Visited Rome",
  date: "2026-06-02",
  latitude: 41.8902,
  longitude: 12.4922,
  photoUri: "file:///colosseum.jpg",
};

async function setup(step: Step = exampleStep) {
  const onPress = jest.fn();
  const onEdit = jest.fn();
  const onDelete = jest.fn();

  const queries = await render(
    <StepCard
      step={step}
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

describe("StepCard", () => {
  test("displays the step name", async () => {
    const { getByText } = await setup();

    expect(getByText("Colosseum")).toBeTruthy();
  });

  test("displays the formatted date", async () => {
    const { getByText } = await setup();

    expect(getByText("02.06.2026")).toBeTruthy();
  });

  test("shows a fallback name for an unnamed step", async () => {
    const { getByText } = await setup({
      ...exampleStep,
      name: "",
    });

    expect(getByText("Unnamed step")).toBeTruthy();
  });

  test("renders a photo when the step has one", async () => {
    const { getByLabelText } = await setup();

    expect(getByLabelText("Photo of Colosseum")).toBeTruthy();
  });

  test("renders a placeholder when no photo exists", async () => {
    const { queryByTestId } = await setup({
      ...exampleStep,
      photoUri: undefined,
    });

    expect(queryByTestId("step-photo")).toBeNull();
  });

  test("calls onEdit when edit is pressed", async () => {
    const { getByLabelText, onEdit, onPress } = await setup();

    fireEvent.press(getByLabelText("Edit step"));

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onPress).not.toHaveBeenCalled();
  });

  test("calls onDelete when delete is pressed", async () => {
    const { getByLabelText, onDelete, onPress } = await setup();

    fireEvent.press(getByLabelText("Delete step"));

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onPress).not.toHaveBeenCalled();
  });

  test("does not delete when edit is pressed", async () => {
    const { getByLabelText, onEdit, onDelete } = await setup();

    fireEvent.press(getByLabelText("Edit step"));

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onDelete).not.toHaveBeenCalled();
  });

  test("does not edit when delete is pressed", async () => {
    const { getByLabelText, onEdit, onDelete } = await setup();

    fireEvent.press(getByLabelText("Delete step"));

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onEdit).not.toHaveBeenCalled();
  });
});
