import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { initializeDatabase } from "@/services/database";
import { loadTripData } from "@/services/tripStorage";
import { useTripStore } from "@/store/tripStore";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SQLiteProvider, type SQLiteDatabase } from "expo-sqlite";
import { useColorScheme } from "react-native";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

async function initializeApp(db: SQLiteDatabase): Promise<void> {
  await initializeDatabase(db);

  const { trips, steps } = await loadTripData(db);

  useTripStore.getState().setStoredData(trips, steps);
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SQLiteProvider databaseName="footprints.db" onInit={initializeApp}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>

        <AnimatedSplashOverlay />
      </ThemeProvider>
    </SQLiteProvider>
  );
}
