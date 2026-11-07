import { Colors } from "@/constants/theme";
import type { Step } from "@/types/Step";
import { formatDisplayDate, toStorageDate } from "@/utils/date";
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

type StepFormValues = Pick<Step, "name" | "note" | "date">;

type StepFormProps = {
  initialValues?: StepFormValues;

  onSubmit: (
    values: StepFormValues,
  ) => boolean | void | Promise<boolean | void>;
};

export function StepForm({ initialValues, onSubmit }: StepFormProps) {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [note, setNote] = useState(initialValues?.note ?? "");
  const [date, setDate] = useState<Date | null>(() =>
    initialValues?.date ? new Date(initialValues.date + "T12:00:00") : null,
  );
  const [error, setError] = useState<string | null>(null);
  const submitted = useRef(false);
  const [saving, setSaving] = useState(false);

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

  async function handleSaveStep() {
    if (submitted.current) {
      return;
    }

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

  return (
    <SafeAreaView style={styles.screen} edges={["left", "right", "bottom"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
      >
        <Text style={styles.label}>Step name</Text>

        <TextInput
          style={styles.input}
          value={name}
          onChangeText={(text) => {
            setName(text);
            setError(null);
          }}
          maxLength={80}
          editable={!saving}
        />

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
          editable={!saving}
        />

        <Text style={styles.label}>Date</Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Select step date"
          onPress={openDatePicker}
          disabled={saving}
          style={({ pressed }) => [styles.input, pressed && styles.pressed]}
        >
          <Text style={[styles.text, !date && styles.placeholder]}>
            {date ? formatDisplayDate(toStorageDate(date)) : "TT.MM.JJJJ"}
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
          title={saving ? "Saving..." : "Save step"}
          color={Colors.light.primary}
          disabled={saving}
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
