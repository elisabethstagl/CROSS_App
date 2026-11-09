import React from "react";
import { render } from "@testing-library/react-native";

import AppHeader from "../../src/components/AppHeader";

jest.mock("@/hooks/use-theme", () => ({
  useTheme: () => ({
    text: "#242824",
    textSecondary: "#68736C",
    primary: "#3F6654",
  }),
}));

jest.mock("../../src/components/FootprintsLogo", () => {
  const { View } =
    jest.requireActual<typeof import("react-native")>("react-native");
  return {
    __esModule: true,
    default: () => <View testID="footprints-logo" />,
  };
});

describe("AppHeader", () => {
  test("displays the Footprints brand", async () => {
    const { getByText } = await render(<AppHeader title="My Trips" />);

    expect(getByText("FOOTPRINTS")).toBeTruthy();
  });

  test("displays the page title", async () => {
    const { getByText } = await render(<AppHeader title="Discover" />);

    expect(getByText("Discover")).toBeTruthy();
  });

  test("displays the optional subtitle", async () => {
    const { getByText } = await render(
      <AppHeader title="Favourites" subtitle="Countries you want to visit" />,
    );

    expect(getByText("Countries you want to visit")).toBeTruthy();
  });

  test("works without a subtitle", async () => {
    const { getByText } = await render(<AppHeader title="My Trips" />);

    expect(getByText("My Trips")).toBeTruthy();
  });

  test("renders the Footprints logo", async () => {
    const { getByTestId } = await render(<AppHeader title="My Trips" />);

    expect(getByTestId("footprints-logo")).toBeTruthy();
  });
});
