import { Colors } from "@/constants/theme";
import type { Trip } from "@/types/Trip";
import { formatDisplayDate, isValidDate } from "@/utils/date";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
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

type TripFormProps = {
  initialValues?: Omit<Trip, "id">;

  onSubmit: (values: Omit<Trip, "id">) => void | Promise<void>;
};

export function TripForm({ initialValues, onSubmit }: TripFormProps) {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [startDate, setStartDate] = useState(initialValues?.startDate ?? "");
  const [endDate, setEndDate] = useState(initialValues?.endDate ?? "");
  const [error, setError] = useState<string | null>(null);
  const submitted = useRef(false);
  const [saving, setSaving] = useState(false);

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

  async function handleSaveTrip() {
    if (submitted.current) {
      return;
    }

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Please enter a trip name.");
      return;
    }

    if (!isValidDate(startDate) || !isValidDate(endDate)) {
      setError("Please select valid start and end dates.");
      return;
    }

    if (endDate < startDate) {
      setError("The end date must not be before the start date.");
      return;
    }

    submitted.current = true;
    setSaving(true);
    setError(null);

    try {
      await onSubmit({
        name: trimmedName,
        startDate,
        endDate,
      });
    } catch {
      setError("Could not save the trip. Please try again.");

      submitted.current = false;
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.screen} edges={["left", "right", "bottom"]}>
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

        <View style={{ minHeight: 48, justifyContent: "center" }}>
          {error && (
            <Text
              accessibilityRole="alert"
              style={{
                color: Colors.light.error,
                fontSize: 14,
                lineHeight: 20,
              }}
            >
              {error}
            </Text>
          )}
        </View>

        <Button
          title={saving ? "Saving..." : "Save trip"}
          color={Colors.light.primary}
          disabled={saving}
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
