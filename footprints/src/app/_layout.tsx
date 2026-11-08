import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { Colors } from "@/constants/theme";
import { initializeDatabase } from "@/services/database/database";
import { loadTripData } from "@/services/database/tripStorage";
import { useTripStore } from "@/store/tripStore";

import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";

import * as SplashScreen from "expo-splash-screen";

import { SQLiteProvider, type SQLiteDatabase } from "expo-sqlite";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { StatusBar } from "expo-status-bar";

import { loadFavourites } from "@/services/database/favouritesStorage";
import { useCountriesStore } from "@/store/useCountriesStore";

import FootprintsLogo from "@/components/FootprintsLogo";
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";
import { Text, View } from "react-native";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: "(tabs)",
};

async function initializeApp(db: SQLiteDatabase): Promise<void> {
  await initializeDatabase(db);

  const { trips, steps } = await loadTripData(db);

  useTripStore.getState().setStoredData(trips, steps);

  const favourites = await loadFavourites(db);

  useCountriesStore.setState({
    favourites,
    favouritesLoaded: true,
  });
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const colors = isDark ? Colors.dark : Colors.light;

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.background).catch(
      (error: unknown) => {
        console.warn("Could not update app background.", error);
      },
    );
  }, [colors.background]);

  const navigationTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      primary: colors.primary,
      background: colors.background,
      card: colors.background,
      text: colors.text,
      border: colors.outline,
      notification: colors.accent,
    },
  };

  const headerOptions = (theme: typeof DefaultTheme) => ({
    headerStyle: {
      backgroundColor: theme.colors.background,
    },
    headerTintColor: theme.colors.text,
    headerTitleStyle: {
      color: theme.colors.text,
    },
    contentStyle: {
      backgroundColor: theme.colors.background,
    },

    headerTitle: ({ children }: { children: string }) => (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
        }}
      >
        <FootprintsLogo size={28} />

        <View style={{ flexShrink: 1 }}>
          <Text
            style={{
              color: theme.colors.primary,
              fontSize: 10,
              fontWeight: "800",
              letterSpacing: 1.5,
            }}
          >
            FOOTPRINTS
          </Text>

          <Text
            numberOfLines={1}
            style={{
              color: theme.colors.text,
              fontSize: 16,
              fontWeight: "600",
              marginTop: 1,
            }}
          >
            {children}
          </Text>
        </View>
      </View>
    ),
  });

  return (
    <ThemeProvider value={navigationTheme}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <SQLiteProvider databaseName="footprints.db" onInit={initializeApp}>
        <Stack
          screenOptions={({ theme }) => ({
            ...headerOptions(theme),
            animation: "fade",
          })}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

          <Stack.Screen name="trip/create" options={{ title: "Create trip" }} />

          <Stack.Screen name="trip/edit" options={{ title: "Edit trip" }} />

          <Stack.Screen name="step/create" options={{ title: "Create step" }} />

          <Stack.Screen name="step/edit" options={{ title: "Edit step" }} />
        </Stack>

        <AnimatedSplashOverlay />
      </SQLiteProvider>
    </ThemeProvider>
  );
}
