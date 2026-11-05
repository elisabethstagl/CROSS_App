
import { MaterialIcons } from "@react-native-vector-icons/material-icons";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Card } from "@/components/Card";
import {
  BorderRadius,
  IconSize,
  Spacing,
} from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Trip } from "@/types/Trip";

type TripCardProps = {
  trip: Trip;
  onPress?: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function TripCard({
  trip,
  onPress,
  onEdit,
  onDelete,
}: TripCardProps) {
  const colors = useTheme();

  return (
    <Card onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.info}>
          <Text
            style={[
              styles.name,
              { color: colors.text },
            ]}
          >
            {trip.name}
          </Text>

          <Text
            style={[
              styles.date,
              { color: colors.textSecondary },
            ]}
          >
            {trip.startDate} – {trip.endDate}
          </Text>
        </View>

        <View style={styles.actions}>
          <Pressable
            style={[
              styles.actionButton,
              {
                backgroundColor: colors.surfaceVariant,
              },
            ]}
            onPress={onEdit}
            hitSlop={8}
          >
            <MaterialIcons
              name="edit"
              size={IconSize.medium}
              color={colors.text}
            />
          </Pressable>

          <Pressable
            style={[
              styles.actionButton,
              {
                backgroundColor: colors.surfaceVariant,
              },
            ]}
            onPress={onDelete}
            hitSlop={8}
          >
            <MaterialIcons
              name="delete-outline"
              size={IconSize.medium}
              color={colors.error}
            />
          </Pressable>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },

  info: {
    flex: 1,
  },

  name: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: Spacing.one,
  },

  date: {
    fontSize: 14,
  },

  actions: {
    flexDirection: "row",
    gap: Spacing.two,
    marginLeft: Spacing.three,
  },

  actionButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
});
