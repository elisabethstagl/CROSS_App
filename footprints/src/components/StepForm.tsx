
import { useTheme } from "@/hooks/use-theme";
import type { Step } from "@/types/Step";
import { formatDisplayDate, toStorageDate } from "@/utils/date";
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

type StepFormValues = Pick<Step, "name" | "note" | "date">;

type StepFormProps = {
  initialValues?: StepFormValues;
  onSubmit: (
    values: StepFormValues
  ) => boolean | void | Promise<boolean | void>;
};

export function StepForm({ initialValues, onSubmit }: StepFormProps) {
  const colors = useTheme();

  const [name, setName] = useState(initialValues?.name ?? "");
  const [note, setNote] = useState(initialValues?.note ?? "");
  const [date, setDate] = useState<Date | null>(() =>
    initialValues?.date
      ? new Date(initialValues.date + "T12:00:00")
      : null
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const submitted = useRef(false);

  function openDatePicker() {
    if (saving) return;

    DateTimePickerAndroid.open({
      mode: "date",
      display: "calendar",
      value: date ?? new Date(),
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

        setDate(selectedDate);
        setError(null);
      },
    });
  }

  async function handleSaveStep() {
    if (submitted.current) return;

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Please enter a step name.");
      return;
    }

    if (!date || Number.isNaN(date.getTime())) {
      setError("Please select a valid date.");
      return;
    }

    submitted.current = true;
    setSaving(true);
    setError(null);

    try {
      const accepted = await onSubmit({
        name: trimmedName,
        note: note.trim(),
        date: toStorageDate(date),
      });

      if (accepted === false) {
        submitted.current = false;
        setSaving(false);
      }
    } catch {
      setError("Could not save the step. Please try again.");
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
      style={[
        styles.screen,
        { backgroundColor: colors.background },
      ]}
      edges={["left", "right", "bottom"]}
    >
      <ScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
      >
        <Text style={[styles.label, { color: colors.text }]}>
          Step name
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
          placeholder="Visit the Colosseum"
          placeholderTextColor={colors.textSecondary}
          selectionColor={colors.primary}
          maxLength={80}
          editable={!saving}
        />

        <Text style={[styles.label, { color: colors.text }]}>
          Note
        </Text>

        <TextInput
          style={[
            styles.input,
            styles.noteInput,
            fieldStyle,
            { color: colors.text },
          ]}
          value={note}
          onChangeText={(text) => {
            setNote(text);
            setError(null);
          }}
          placeholder="Write something about this step..."
          placeholderTextColor={colors.textSecondary}
          selectionColor={colors.primary}
          multiline
          maxLength={2000}
          editable={!saving}
        />

        <Text style={[styles.label, { color: colors.text }]}>
          Date
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Select step date"
          disabled={saving}
          onPress={openDatePicker}
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
                color: date
                  ? colors.text
                  : colors.textSecondary,
              },
            ]}
          >
            {date
              ? formatDisplayDate(toStorageDate(date))
              : "Select date"}
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
          onPress={handleSaveStep}
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
              Save step
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
  content: {
    padding: 24,
    gap: 12,
    paddingBottom: 48,
  },
  label: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
  },
  input: {
    minHeight: 56,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 12,
    fontSize: 16,
  },
  noteInput: {
    minHeight: 140,
    textAlignVertical: "top",
  },
  dateField: {
    minHeight: 56,
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 12,
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
