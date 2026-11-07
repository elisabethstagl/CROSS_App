import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { Colors } from "@/constants/theme";
import { initializeDatabase } from "@/services/database/database";
import { loadTripData } from "@/services/database/tripStorage";
import { useTripStore } from "@/store/tripStore";

import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";

import * as SplashScreen from "expo-splash-screen";

import { SQLiteProvider, type SQLiteDatabase } from "expo-sqlite";

import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "@/hooks/use-color-scheme";

import { useCountriesStore } from "@/store/useCountriesStore";
import { loadFavourites } from "@/services/database/favouritesStorage";

import { Text, View } from "react-native";
import FootprintsLogo from "@/components/FootprintsLogo";

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

  const headerOptions = {
    headerStyle: {
      backgroundColor: colors.background,
    },
    headerTintColor: colors.text,
    headerTitleStyle: {
      color: colors.text,
    },
    contentStyle: {
      backgroundColor: colors.background,
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

        <View
          style={{
            flexShrink: 1,
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: colors.primary,
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
              color: colors.text,
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
  };

  return (
    <SQLiteProvider databaseName="footprints.db" onInit={initializeApp}>
      <ThemeProvider value={navigationTheme}>
        <StatusBar style={isDark ? "light" : "dark"} />

        <Stack
          screenOptions={{
            ...headerOptions,
            animation: "fade",
            contentStyle: {
              backgroundColor: colors.background,
            },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

          <Stack.Screen
            name="trip/create"
            options={{
              ...headerOptions,
              title: "Create trip",
            }}
          />

          <Stack.Screen
            name="trip/edit"
            options={{
              ...headerOptions,
              title: "Edit trip",
            }}
          />

          <Stack.Screen
            name="step/create"
            options={{
              ...headerOptions,
              title: "Create step",
            }}
          />

          <Stack.Screen
            name="step/edit"
            options={{
              ...headerOptions,
              title: "Edit step",
            }}
          />
        </Stack>

        <AnimatedSplashOverlay />
      </ThemeProvider>
    </SQLiteProvider>
  );
}
