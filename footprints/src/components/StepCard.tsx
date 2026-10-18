import { MaterialIcons } from "@react-native-vector-icons/material-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Card } from "@/components/Card";
import { BorderRadius, Colors, IconSize, Spacing } from "@/constants/theme";
import type { Step } from "@/types/Step";
import { formatDisplayDate } from "@/utils/date";

type StepCardProps = {
  step: Step;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function StepCard({ step, onPress, onEdit, onDelete }: StepCardProps) {
  return (
    <Card onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.info}>
          <Text style={styles.name}>{step.name || "Unnamed step"}</Text>

          <Text style={styles.date}>{formatDisplayDate(step.date)}</Text>
        </View>

        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Edit step"
            style={styles.actionButton}
            hitSlop={8}
            onPress={(event) => {
              event.stopPropagation();
              onEdit();
            }}
          >
            <MaterialIcons
              name="edit"
              size={IconSize.medium}
              color={Colors.light.text}
            />
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Delete step"
            style={styles.actionButton}
            hitSlop={8}
            onPress={(event) => {
              event.stopPropagation();
              onDelete();
            }}
          >
            <MaterialIcons
              name="delete-outline"
              size={IconSize.medium}
              color={Colors.light.error}
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
    color: Colors.light.text,
    marginBottom: Spacing.one,
  },

  date: {
    fontSize: 14,
    color: Colors.light.textSecondary,
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
    backgroundColor: Colors.light.surfaceVariant,
  },
});
