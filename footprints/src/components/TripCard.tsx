import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@react-native-vector-icons/material-icons";

import { Card } from "@/components/Card";
import { Trip } from "@/types/Trip";

type TripCardProps = {
  trip: Trip;
  onPress?: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function TripCard({ trip, onPress, onEdit, onDelete }: TripCardProps) {
  return (
    <Card onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.info}>
          <Text style={styles.name}>{trip.name}</Text>

          <Text style={styles.date}>
            {trip.startDate} – {trip.endDate}
          </Text>
        </View>

        <View style={styles.actions}>
          <Pressable style={styles.actionButton} onPress={onEdit} hitSlop={8}>
            <MaterialIcons name="edit" size={22} color="#333" />
          </Pressable>

          <Pressable style={styles.actionButton} onPress={onDelete} hitSlop={8}>
            <MaterialIcons name="delete-outline" size={22} color="#c62828" />
          </Pressable>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  info: {
    flex: 1,
  },

  name: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 6,
  },

  date: {
    fontSize: 14,
    color: "#666",
  },

  actions: {
    flexDirection: "row",
    gap: 8,
    marginLeft: 12,
  },

  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f2f2f2",
  },
});
