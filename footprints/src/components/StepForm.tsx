import { useTheme } from "@/hooks/use-theme";
import type { Step } from "@/types/Step";
import { formatDisplayDate, toStorageDate } from "@/utils/date";

import {
  getCurrentStepLocation,
  getPlaceName,
  takeStepPhoto,
  saveStepPhoto,
  deleteStepPhoto,
} from "@/services/nativeFeatures";

import { MaterialIcons } from "@react-native-vector-icons/material-icons";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { Image } from "expo-image";
import { useEffect, useRef, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export type StepFormValues = Pick<
  Step,
  "name" | "note" | "date" | "latitude" | "longitude" | "photoUri"
>;

type StepFormProps = {
  initialValues?: StepFormValues;
  onSubmit: (
    values: StepFormValues,
  ) => boolean | void | Promise<boolean | void>;
};

export function StepForm({ initialValues, onSubmit }: StepFormProps) {
  const colors = useTheme();

  const [name, setName] = useState(initialValues?.name ?? "");

  const [note, setNote] = useState(initialValues?.note ?? "");

  const [date, setDate] = useState<Date | null>(() =>
    initialValues?.date ? new Date(initialValues.date + "T12:00:00") : null,
  );

  const [latitude, setLatitude] = useState<number | undefined>(
    initialValues?.latitude,
  );

  const [longitude, setLongitude] = useState<number | undefined>(
    initialValues?.longitude,
  );

  const [placeName, setPlaceName] = useState<string | null>(null);

  const [photoUri, setPhotoUri] = useState<string | undefined>(
    initialValues?.photoUri,
  );

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loadingCamera, setLoadingCamera] = useState(false);

  const submitted = useRef(false);

  const busy = saving || loadingLocation || loadingCamera;

  const hasLocation = latitude != null && longitude != null;

  const fieldStyle = {
    backgroundColor: colors.surface,
    borderColor: colors.outline,
  };

  useEffect(() => {
    if (latitude == null || longitude == null) {
      setPlaceName(null);
      return;
    }

    let active = true;

    setPlaceName(null);

    async function loadPlaceName() {
      const place = await getPlaceName(latitude!, longitude!);

      if (active) {
        setPlaceName(place);
      }
    }

    loadPlaceName();

    return () => {
      active = false;
    };
  }, [latitude, longitude]);

  function openDatePicker() {
    if (busy) return;

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
        if (event.type !== "set" || !selectedDate) {
          return;
        }

        setDate(selectedDate);
        setError(null);
      },
    });
  }

  async function handleGetLocation() {
    if (busy) return;

    setLoadingLocation(true);
    setError(null);

    try {
      const location = await getCurrentStepLocation();

      setLatitude(location.latitude);
      setLongitude(location.longitude);

    } catch (error) {
      Alert.alert(
        "Location unavailable",
        error instanceof Error
          ? error.message
          : "Could not get your current location.",
      );
    } finally {
      setLoadingLocation(false);
    }
  }

  async function handleTakePhoto() {
    if (busy) return;

    setLoadingCamera(true);
    setError(null);

    try {
      const uri = await takeStepPhoto();

      if (uri) {
        setPhotoUri(uri);
      }
    } catch (error) {
      Alert.alert(
        "Camera unavailable",
        error instanceof Error ? error.message : "Could not open the camera.",
      );
    } finally {
      setLoadingCamera(false);
    }
  }

  function handleRemovePhoto() {
    if (busy) return;

    setPhotoUri(undefined);
  }

  function handleRemoveLocation() {
    if (busy) return;

    setLatitude(undefined);
    setLongitude(undefined);
    setPlaceName(null);
  }

  async function handleSaveStep() {
    if (submitted.current || busy) return;

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

    let newSavedPhoto: string | undefined;

    try {
      let finalPhotoUri = photoUri;

      if (photoUri && photoUri !== initialValues?.photoUri) {
        newSavedPhoto = saveStepPhoto(photoUri);
        finalPhotoUri = newSavedPhoto;
      }

      const accepted = await onSubmit({
        name: trimmedName,
        note: note.trim(),
        date: toStorageDate(date),
        latitude,
        longitude,
        photoUri: finalPhotoUri,
      });

      if (accepted === false) {
        if (newSavedPhoto) {
          deleteStepPhoto(newSavedPhoto);
        }

        submitted.current = false;
        setSaving(false);
        return;
      }
    } catch {
      if (newSavedPhoto) {
        deleteStepPhoto(newSavedPhoto);
      }

      setError("Could not save the step. Please try again.");

      submitted.current = false;
      setSaving(false);
    }
  }

  return (
    <SafeAreaView
      style={[styles.screen, { backgroundColor: colors.background }]}
      edges={["left", "right", "bottom"]}
    >
      <ScrollView
        style={{
          backgroundColor: colors.background,
        }}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
      >

        <Text style={[styles.label, { color: colors.text }]}>Step name</Text>

        <TextInput
          style={[styles.input, fieldStyle, { color: colors.text }]}
          value={name}
          onChangeText={(value) => {
            setName(value);
            setError(null);
          }}
          placeholder="Visit the Colosseum"
          placeholderTextColor={colors.textSecondary}
          selectionColor={colors.primary}
          maxLength={80}
          editable={!busy}
        />

        <Text style={[styles.label, { color: colors.text }]}>Note</Text>

        <TextInput
          style={[
            styles.input,
            styles.noteInput,
            fieldStyle,
            { color: colors.text },
          ]}
          value={note}
          onChangeText={setNote}
          placeholder="Write something about this step..."
          placeholderTextColor={colors.textSecondary}
          selectionColor={colors.primary}
          multiline
          maxLength={2000}
          editable={!busy}
        />

        <Text style={[styles.label, { color: colors.text }]}>Date</Text>

        <Pressable
          disabled={busy}
          onPress={openDatePicker}
          style={[styles.input, styles.dateField, fieldStyle]}
        >
          <Text
            style={{
              color: date ? colors.text : colors.textSecondary,
              fontSize: 16,
            }}
          >
            {date ? formatDisplayDate(toStorageDate(date)) : "Select date"}
          </Text>
        </Pressable>

        <Text style={[styles.label, { color: colors.text }]}>Location</Text>

        <View style={[styles.nativeSection, fieldStyle]}>
          {hasLocation ? (
            <View style={styles.locationRow}>
              <MaterialIcons
                name="location-on"
                size={24}
                color={colors.primary}
              />

              <View style={{ flex: 1 }}>
                <Text style={[styles.valueText, { color: colors.text }]}>
                  Location captured
                </Text>

                <Text
                  style={{
                    color: colors.textSecondary,
                    marginTop: 4,
                  }}
                >
                  {placeName ??
                    `${latitude?.toFixed(6)}, ${longitude?.toFixed(6)}`}
                </Text>
              </View>
            </View>
          ) : (
            <Text
              style={{
                color: colors.textSecondary,
              }}
            >
              No location selected
            </Text>
          )}

          <Pressable
            disabled={busy}
            onPress={handleGetLocation}
            style={[
              styles.nativeButton,
              {
                backgroundColor: colors.primaryContainer,
              },
            ]}
          >
            {loadingLocation ? (
              <ActivityIndicator color={colors.onPrimaryContainer} />
            ) : (
              <MaterialIcons
                name="my-location"
                size={22}
                color={colors.onPrimaryContainer}
              />
            )}

            <Text
              style={[
                styles.nativeButtonText,
                {
                  color: colors.onPrimaryContainer,
                },
              ]}
            >
              {loadingLocation
                ? "Getting location..."
                : hasLocation
                  ? "Update location"
                  : "Get current location"}
            </Text>
          </Pressable>

          {hasLocation && (
            <Pressable disabled={busy} onPress={handleRemoveLocation}>
              <Text style={[styles.removeText, { color: colors.error }]}>
                Remove location
              </Text>
            </Pressable>
          )}
        </View>

        <Text style={[styles.label, { color: colors.text }]}>Photo</Text>

        <View style={[styles.nativeSection, fieldStyle]}>
          {photoUri ? (
            <Image
              source={{ uri: photoUri }}
              style={styles.photoPreview}
              contentFit="cover"
            />
          ) : (
            <View style={styles.emptyPhoto}>
              <MaterialIcons
                name="photo-camera"
                size={40}
                color={colors.textSecondary}
              />

              <Text
                style={{
                  color: colors.textSecondary,
                  marginTop: 8,
                }}
              >
                No photo selected
              </Text>
            </View>
          )}

          <Pressable
            disabled={busy}
            onPress={handleTakePhoto}
            style={[
              styles.nativeButton,
              {
                backgroundColor: colors.primaryContainer,
              },
            ]}
          >
            {loadingCamera ? (
              <ActivityIndicator color={colors.onPrimaryContainer} />
            ) : (
              <MaterialIcons
                name="photo-camera"
                size={22}
                color={colors.onPrimaryContainer}
              />
            )}

            <Text
              style={[
                styles.nativeButtonText,
                {
                  color: colors.onPrimaryContainer,
                },
              ]}
            >
              {loadingCamera
                ? "Opening camera..."
                : photoUri
                  ? "Retake photo"
                  : "Take photo"}
            </Text>
          </Pressable>

          {photoUri && (
            <Pressable disabled={busy} onPress={handleRemovePhoto}>
              <Text style={[styles.removeText, { color: colors.error }]}>
                Remove photo
              </Text>
            </Pressable>
          )}
        </View>

        {error && (
          <Text
            accessibilityRole="alert"
            style={[styles.error, { color: colors.error }]}
          >
            {error}
          </Text>
        )}

        <Pressable
          disabled={busy}
          onPress={handleSaveStep}
          style={({ pressed }) => [
            styles.saveButton,
            {
              backgroundColor: colors.primary,
            },
            pressed && { opacity: 0.8 },
            busy && { opacity: 0.65 },
          ]}
        >
          {saving ? (
            <ActivityIndicator color={colors.onPrimary} />
          ) : (
            <Text style={[styles.saveButtonText, { color: colors.onPrimary }]}>
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
    paddingBottom: 60,
  },

  label: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
  },

  input: {
    minHeight: 56,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },

  noteInput: {
    minHeight: 140,
    textAlignVertical: "top",
  },

  dateField: {
    justifyContent: "center",
  },

  nativeSection: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  valueText: {
    fontSize: 16,
    fontWeight: "600",
  },

  nativeButton: {
    minHeight: 50,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 12,
  },

  nativeButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },

  photoPreview: {
    width: "100%",
    aspectRatio: 4 / 3,
    borderRadius: 12,
  },

  emptyPhoto: {
    minHeight: 130,
    alignItems: "center",
    justifyContent: "center",
  },

  removeText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
  },

  error: {
    fontSize: 14,
    marginTop: 8,
  },

  saveButton: {
    minHeight: 56,
    marginTop: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  saveButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },
});
