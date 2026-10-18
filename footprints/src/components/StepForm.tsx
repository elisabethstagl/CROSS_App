import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
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
import type { Step } from "@/types/Step";
import { Colors } from "@/constants/theme";
import { formatDisplayDate, toStorageDate } from "@/utils/date";

type StepFormValues = Pick<Step, "name" | "note" | "date">;

type StepFormProps = {
  initialValues?: StepFormValues;
  onSubmit: (values: StepFormValues) => void;
};

export function StepForm({ initialValues, onSubmit }: StepFormProps) {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [note, setNote] = useState(initialValues?.note ?? "");
  const [date, setDate] = useState<Date | null>(() =>
    initialValues?.date ? new Date(initialValues.date + "T12:00:00") : null,
  );
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
    if (submitted.current) {
      return;
    }

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Please enter a step name.");
      return;
    }

    const trimmedNote = note.trim();

    if (!date || Number.isNaN(date.getTime())) {
      setError("Please select a valid date.");
      return;
    }

    submitted.current = true;

    onSubmit({
      name: trimmedName,
      note: trimmedNote,
      date: toStorageDate(date),
    });
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
