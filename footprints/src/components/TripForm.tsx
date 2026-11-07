
import { useTheme } from "@/hooks/use-theme";
import type { Trip } from "@/types/Trip";
import { formatDisplayDate, isValidDate } from "@/utils/date";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
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
  const colors = useTheme();

  const [name, setName] = useState(initialValues?.name ?? "");
  const [startDate, setStartDate] = useState(initialValues?.startDate ?? "");
  const [endDate, setEndDate] = useState(initialValues?.endDate ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const submitted = useRef(false);

  function openDatePicker(field: "start" | "end") {
    if (saving) return;

    const currentValue = field === "start" ? startDate : endDate;
    const parsedDate = new Date(currentValue + "T12:00:00");

    DateTimePickerAndroid.open({
      mode: "date",
      display: "calendar",
      value: Number.isNaN(parsedDate.getTime())
        ? new Date()
        : parsedDate,
      positiveButton: {
        label: "OK",
        textColor: colors.primary,
      },
      negativeButton: {
        label: "Cancel",
        textColor: colors.textSecondary,
      },
      onChange: (event, selectedDate) => {
        if (event.type !== "set" || !selectedDate) return;

        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
        const day = String(selectedDate.getDate()).padStart(2, "0");
        const formattedDate = `${year}-${month}-${day}`;

        if (field === "start") {
          setStartDate(formattedDate);
        } else {
          setEndDate(formattedDate);
        }

        setError(null);
      },
    });
  }

  async function handleSaveTrip() {
    if (submitted.current) return;

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

  const fieldStyle = {
    backgroundColor: colors.surface,
    borderColor: colors.outline,
  };

  return (
    <SafeAreaView
      style={[styles.screen, { backgroundColor: colors.background }]}
      edges={["left", "right", "bottom"]}
    >
      <ScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={styles.form}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
      >
        <Text style={[styles.label, { color: colors.text }]}>
          Trip name
        </Text>

        <TextInput
          style={[
            styles.input,
            fieldStyle,
            { color: colors.text },
          ]}
          value={name}
          onChangeText={(text) => {
            setName(text);
            setError(null);
          }}
          placeholder="Italy 2026"
          placeholderTextColor={colors.textSecondary}
          selectionColor={colors.primary}
          maxLength={80}
          editable={!saving}
        />

        <Text style={[styles.label, { color: colors.text }]}>
          Start date
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Select start date: ${startDate || "not selected"}`}
          disabled={saving}
          onPress={() => openDatePicker("start")}
          style={({ pressed }) => [
            styles.dateField,
            fieldStyle,
            pressed && styles.pressed,
          ]}
        >
          <Text
            style={[
              styles.dateText,
              {
                color: startDate
                  ? colors.text
                  : colors.textSecondary,
              },
            ]}
          >
            {startDate
              ? formatDisplayDate(startDate)
              : "Select start date"}
          </Text>
        </Pressable>

        <Text style={[styles.label, { color: colors.text }]}>
          End date
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Select end date: ${endDate || "not selected"}`}
          disabled={saving}
          onPress={() => openDatePicker("end")}
          style={({ pressed }) => [
            styles.dateField,
            fieldStyle,
            pressed && styles.pressed,
          ]}
        >
          <Text
            style={[
              styles.dateText,
              {
                color: endDate
                  ? colors.text
                  : colors.textSecondary,
              },
            ]}
          >
            {endDate
              ? formatDisplayDate(endDate)
              : "Select end date"}
          </Text>
        </Pressable>

        <View style={styles.errorContainer}>
          {error && (
            <Text
              accessibilityRole="alert"
              style={[styles.error, { color: colors.error }]}
            >
              {error}
            </Text>
          )}
        </View>

        <Pressable
          accessibilityRole="button"
          disabled={saving}
          onPress={handleSaveTrip}
          style={({ pressed }) => [
            styles.saveButton,
            { backgroundColor: colors.primary },
            pressed && styles.pressed,
            saving && styles.disabled,
          ]}
        >
          {saving ? (
            <ActivityIndicator color={colors.onPrimary} />
          ) : (
            <Text
              style={[
                styles.saveButtonText,
                { color: colors.onPrimary },
              ]}
            >
              Save trip
            </Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  form: {
    padding: 24,
    gap: 12,
    paddingBottom: 48,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
  },
  input: {
    minHeight: 56,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  dateField: {
    minHeight: 56,
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dateText: {
    fontSize: 16,
  },
  errorContainer: {
    minHeight: 48,
    justifyContent: "center",
  },
  error: {
    fontSize: 14,
    lineHeight: 20,
  },
  saveButton: {
    minHeight: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.75,
  },
  disabled: {
    opacity: 0.65,
  },
});
