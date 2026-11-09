import { MaterialIcons } from "@react-native-vector-icons/material-icons";
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { BorderRadius, IconSize, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useTripStore } from "@/store/tripStore";
import type { Trip } from "@/types/Trip";
import { formatDisplayDate } from "@/utils/date";

type TripCardProps = {
  trip: Trip;
  onPress?: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function TripCard({ trip, onPress, onEdit, onDelete }: TripCardProps) {
  const colors = useTheme();

  const coverPhotoUri = useTripStore((state) => {
    const stepWithPhoto = state.steps.find(
      (step) => step.tripId === trip.id && !!step.photoUri,
    );

    return stepWithPhoto?.photoUri;
  });

  const stepCount = useTripStore(
    (state) => state.steps.filter((step) => step.tripId === trip.id).length,
  );

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole="button"
      accessibilityLabel={`Open trip ${trip.name}`}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.outline,
        },
        pressed && onPress && styles.pressed,
      ]}
    >
      {coverPhotoUri ? (
        <Image
          source={{ uri: coverPhotoUri }}
          style={styles.coverImage}
          contentFit="cover"
          accessibilityLabel={`Cover photo for ${trip.name}`}
        />
      ) : (
        <View
          style={[
            styles.coverPlaceholder,
            {
              backgroundColor: colors.primaryContainer,
            },
          ]}
        >
          <MaterialIcons name="landscape" size={52} color={colors.primary} />

          <Text
            style={[
              styles.placeholderText,
              {
                color: colors.onPrimaryContainer,
              },
            ]}
          >
            Your next adventure
          </Text>
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.info}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>
            {trip.name}
          </Text>

          <Text
            style={[
              styles.date,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            {formatDisplayDate(trip.startDate)}
            {" – "}
            {formatDisplayDate(trip.endDate)}
          </Text>

          <View style={styles.stepCountRow}>
            <MaterialIcons
              name="place"
              size={16}
              color={colors.textSecondary}
            />

            <Text
              style={[
                styles.stepCount,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              {stepCount} {stepCount === 1 ? "step" : "steps"}
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable
            onPress={(event) => {
              event.stopPropagation();
              onEdit();
            }}
            accessibilityRole="button"
            accessibilityLabel={`Edit ${trip.name}`}
            hitSlop={8}
            style={[
              styles.actionButton,
              {
                backgroundColor: colors.surfaceVariant,
              },
            ]}
          >
            <MaterialIcons
              name="edit"
              size={IconSize.medium}
              color={colors.text}
            />
          </Pressable>

          <Pressable
            onPress={(event) => {
              event.stopPropagation();
              onDelete();
            }}
            accessibilityRole="button"
            accessibilityLabel={`Delete ${trip.name}`}
            hitSlop={8}
            style={[
              styles.actionButton,
              {
                backgroundColor: colors.surfaceVariant,
              },
            ]}
          >
            <MaterialIcons
              name="delete-outline"
              size={IconSize.medium}
              color={colors.error}
            />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.large,
    borderWidth: 1,
    overflow: "hidden",
  },

  pressed: {
    opacity: 0.9,
  },

  coverImage: {
    width: "100%",
    height: 190,
  },

  coverPlaceholder: {
    width: "100%",
    height: 190,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
  },

  placeholderText: {
    fontSize: 14,
    fontWeight: "500",
  },

  content: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.three,
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

  stepCountRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    marginTop: Spacing.two,
  },

  stepCount: {
    fontSize: 13,
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
