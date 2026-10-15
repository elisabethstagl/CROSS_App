import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useColorScheme } from "react-native";

import { Colors } from "@/constants/theme";

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === "dark" ? "dark" : "light"];

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.primaryContainer}
      iconColor={{
        default: colors.textSecondary,
        selected: colors.primary,
      }}
      labelStyle={{
        default: {
          color: colors.textSecondary,
        },
        selected: {
          color: colors.primary,
        },
      }}
    >
      <NativeTabs.Trigger
        name="index"
        rippleColor={colors.primaryContainer}
      >
        <NativeTabs.Trigger.Label>
          Home
        </NativeTabs.Trigger.Label>

        <NativeTabs.Trigger.Icon
          src={require("@/assets/images/tabIcons/home.png")}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger
        name="explore"
        rippleColor={colors.primaryContainer}
      >
        <NativeTabs.Trigger.Label>
          Explore
        </NativeTabs.Trigger.Label>

        <NativeTabs.Trigger.Icon
          src={require("@/assets/images/tabIcons/earth.png")}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger
        name="favourites"
        rippleColor={colors.primaryContainer}
      >
        <NativeTabs.Trigger.Label>
          Favourites
        </NativeTabs.Trigger.Label>

        <NativeTabs.Trigger.Icon
          src={require("@/assets/images/tabIcons/heart.png")}
          renderingMode="template"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}