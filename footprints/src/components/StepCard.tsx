
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
import type { Step } from "@/types/Step";
import { formatDisplayDate } from "@/utils/date";

type StepCardProps = {
  step: Step;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function StepCard({
  step,
  onPress,
  onEdit,
  onDelete,
}: StepCardProps) {
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
            {step.name || "Unnamed step"}
          </Text>

          <Text
            style={[
              styles.date,
              { color: colors.textSecondary },
            ]}
          >
            {formatDisplayDate(step.date)}
          </Text>
        </View>

        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Edit step"
            style={[
              styles.actionButton,
              {
                backgroundColor: colors.surfaceVariant,
              },
            ]}
            hitSlop={8}
            onPress={(event) => {
              event.stopPropagation();
              onEdit();
            }}
          >
            <MaterialIcons
              name="edit"
              size={IconSize.medium}
              color={colors.text}
            />
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Delete step"
            style={[
              styles.actionButton,
              {
                backgroundColor: colors.surfaceVariant,
              },
            ]}
            hitSlop={8}
            onPress={(event) => {
              event.stopPropagation();
              onDelete();
            }}
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
