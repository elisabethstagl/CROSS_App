import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import {
  Button,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "@/constants/theme";
import { useTripStore } from "@/store/tripStore";
import { formatDisplayDate } from "@/utils/date";

function toStorageDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function CreateStepScreen() {
  const { tripId } = useLocalSearchParams<{ tripId?: string }>();

  const trip = useTripStore((state) =>
    state.trips.find((item) => item.id === tripId),
  );

  const addStep = useTripStore((state) => state.addStep);

  const [note, setNote] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const submitted = useRef(false);

  function openDatePicker() {
    DateTimePickerAndroid.open({
      mode: "date",
      display: "calendar",
      value: date ?? new Date(),

      positiveButton: {
        label: "OK",
        textColor: Colors.light.primary,
      },

      negativeButton: {
        label: "Cancel",
        textColor: Colors.light.textSecondary,
      },

      onValueChange: (_event, selectedDate) => {
        setDate(selectedDate);
        setError(null);
      },
    });
  }

  function handleSaveStep() {
    if (!trip || submitted.current) {
      return;
    }

    const trimmedNote = note.trim();

    if (!trimmedNote) {
      setError("Please enter a note.");
      return;
    }

    if (!date) {
      setError("Please select a date.");
      return;
    }

    submitted.current = true;

    addStep({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      tripId: trip.id,
      note: trimmedNote,
      date: toStorageDate(date),
    });

    router.dismissTo({
      pathname: "/trip/[id]",
      params: { id: trip.id },
    });
  }

  if (!trip) {
    return (
      <View style={styles.content}>
        <Stack.Screen options={{ title: "Create step" }} />
        <Text style={styles.text}>Trip not found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={["left", "right", "bottom"]}>
      <Stack.Screen options={{ title: "Create step" }} />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
      >
        <Text style={styles.text}>New step for {trip.name}</Text>

        <Text style={styles.label}>Note</Text>

        <TextInput
          style={[styles.input, styles.noteInput]}
          value={note}
          onChangeText={(text) => {
            setNote(text);
            setError(null);
          }}
          multiline
          maxLength={2000}
        />

        <Text style={styles.label}>Date</Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Select step date"
          onPress={openDatePicker}
          style={({ pressed }) => [styles.input, pressed && styles.pressed]}
        >
          <Text style={[styles.text, !date && styles.placeholder]}>
            {date ? formatDisplayDate(toStorageDate(date)) : "TT.MM.JJJJ"}
          </Text>
        </Pressable>

        {error && (
          <Text accessibilityRole="alert" style={styles.error}>
            {error}
          </Text>
        )}

        <Button
          title="Save step"
          color={Colors.light.primary}
          onPress={handleSaveStep}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    padding: 24,
    gap: 12,
  },
  text: {
    fontSize: 16,
    color: Colors.light.text,
  },
  label: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.light.text,
  },
  input: {
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.light.outline,
    borderRadius: 12,
    backgroundColor: Colors.light.surface,
    color: Colors.light.text,
    fontSize: 16,
  },
  noteInput: {
    minHeight: 140,
    textAlignVertical: "top",
  },
  placeholder: {
    color: Colors.light.textSecondary,
  },
  pressed: {
    opacity: 0.7,
  },
  error: {
    color: Colors.light.error,
  },
});
