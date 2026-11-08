import { useNetworkState } from "expo-network";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export default function OfflineBanner() {
  const colors = useTheme();

  const { isConnected, isInternetReachable } = useNetworkState();

  const isOffline = isConnected === false || isInternetReachable === false;

  if (!isOffline) return null;

  return (
    <SafeAreaView
      edges={["left", "right", "bottom"]}
      style={[styles.container, { backgroundColor: colors.primaryContainer }]}
    >
      <Text
        accessibilityLiveRegion="polite"
        style={[styles.text, { color: colors.onPrimaryContainer }]}
      >
        You're offline. Some features may be limited.
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },

  text: {
    fontSize: 13,
    textAlign: "center",
  },
});
