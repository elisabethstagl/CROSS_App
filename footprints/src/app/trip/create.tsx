import { router, Stack } from "expo-router";
import { useRef, useState } from "react";
import {
  Button,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTripStore } from "@/store/tripStore";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { Colors } from "@/constants/theme";

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(value + "T00:00:00.000Z");

  return (
    !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}

function formatDisplayDate(value: string): string {
  if (!value) {
    return "TT.MM.JJJJ";
  }

  const [year, month, day] = value.split("-");

  return `${day}.${month}.${year}`;
}

export default function CreateTripScreen() {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const submitted = useRef(false);

  const addTrip = useTripStore((state) => state.addTrip);

  function openDatePicker(field: "start" | "end") {
    const currentValue = field === "start" ? startDate : endDate;

    const parsedDate = new Date(currentValue + "T12:00:00");

    DateTimePickerAndroid.open({
      mode: "date",
      display: "calendar",

      value: Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate,

      onValueChange: (_event, selectedDate) => {
        const year = selectedDate.getFullYear();

        const month = String(selectedDate.getMonth() + 1).padStart(2, "0");

        const day = String(selectedDate.getDate()).padStart(2, "0");

        const formattedDate = `${year}-${month}-${day}`;

        if (field === "start") {
          setStartDate(formattedDate);
        } else {
          setEndDate(formattedDate);
        }
      },
    });
  }

  function handleSaveTrip() {
    if (submitted.current) {
      return;
    }

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Please enter a trip name.");
      return;
    }

    if (!isValidDate(startDate) || !isValidDate(endDate)) {
      setError("Enter valid dates in YYYY-MM-DD format.");
      return;
    }

    if (endDate < startDate) {
      setError("The end date must not be before the start date.");
      return;
    }

    submitted.current = true;

    addTrip({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: trimmedName,
      startDate,
      endDate,
    });

    router.dismissTo("/");
  }

  return (
    <SafeAreaView style={styles.screen} edges={["left", "right", "bottom"]}>
      <Stack.Screen options={{ title: "Create trip" }} />

      <ScrollView
        contentContainerStyle={styles.form}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
      >
        <Text style={styles.label}>Trip name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Italy 2026"
          placeholderTextColor={Colors.light.textSecondary}
          maxLength={80}
        />
        <Text style={styles.label}>Start date</Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Select start date: ${startDate || "not selected"}`}
          onPress={() => openDatePicker("start")}
          style={({ pressed }) => [
            styles.dateField,
            pressed && styles.dateFieldPressed,
          ]}
        >
          <Text style={[styles.dateText, !startDate && styles.datePlaceholder]}>
            {formatDisplayDate(startDate)}
          </Text>
        </Pressable>

        <Text style={styles.label}>End date</Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Select end date: ${endDate || "not selected"}`}
          onPress={() => openDatePicker("end")}
          style={({ pressed }) => [
            styles.dateField,
            pressed && styles.dateFieldPressed,
          ]}
        >
          <Text style={[styles.dateText, !endDate && styles.datePlaceholder]}>
            {formatDisplayDate(endDate)}
          </Text>
        </Pressable>

        {error && (
          <Text accessibilityRole="alert" style={{ color: Colors.light.error }}>
            {error}
          </Text>
        )}

        <Button
          title="Save trip"
          color={Colors.light.primary}
          onPress={handleSaveTrip}
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
  form: {
    padding: 24,
    gap: 12,
  },
  label: {
    color: Colors.light.text,
    fontSize: 16,
  },
  input: {
    backgroundColor: Colors.light.surface,
    color: Colors.light.text,
    borderWidth: 1,
    borderColor: Colors.light.outline,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  dateField: {
    minHeight: 56,
    justifyContent: "center",
    backgroundColor: Colors.light.surface,
    borderWidth: 1,
    borderColor: Colors.light.outline,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },

  dateText: {
    color: Colors.light.text,
    fontSize: 16,
  },

  datePlaceholder: {
    color: Colors.light.textSecondary,
  },

  dateFieldPressed: {
    opacity: 0.7,
  },
});
