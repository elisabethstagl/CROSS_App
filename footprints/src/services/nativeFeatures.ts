import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import { Directory, File, Paths } from "expo-file-system";

export type StepLocation = {
  latitude: number;
  longitude: number;
};

export async function getCurrentStepLocation(): Promise<StepLocation> {
  const permission = await Location.requestForegroundPermissionsAsync();

  if (!permission.granted) {
    throw new Error(
      "Location permission was denied. Enable it in Android Settings.",
    );
  }

  const enabled = await Location.hasServicesEnabledAsync();

  if (!enabled) {
    throw new Error("Location services are disabled. Please enable GPS.");
  }

  const cached = await Location.getLastKnownPositionAsync({
    maxAge: 5 * 60 * 1000,
    requiredAccuracy: 1000,
  });

  if (cached) {
    return {
      latitude: cached.coords.latitude,
      longitude: cached.coords.longitude,
    };
  }

  const positionPromise = Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(
        new Error(
          "Location could not be determined within 15 seconds. Try moving outdoors or enabling GPS.",
        ),
      );
    }, 15000);
  });

  try {
    const position = await Promise.race([positionPromise, timeoutPromise]);

    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

export async function takeStepPhoto(): Promise<string | null> {
  const permission = await ImagePicker.requestCameraPermissionsAsync();

  if (!permission.granted) {
    throw new Error(
      "Camera permission was denied. You can enable it in Android Settings.",
    );
  }

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ["images"],
    allowsEditing: false,
    quality: 0.85,
  });

  if (result.canceled || !result.assets.length) {
    return null;
  }

  return result.assets[0].uri;
}

export function saveStepPhoto(temporaryUri: string): string {
  const photoDirectory = new Directory(Paths.document, "step-photos");

  photoDirectory.create({
    idempotent: true,
    intermediates: true,
  });

  const source = new File(temporaryUri);

  const extension = source.extension.toLowerCase() === ".png" ? ".png" : ".jpg";

  const filename = `step-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}${extension}`;

  const destination = new File(photoDirectory, filename);

  source.copy(destination);

  return destination.uri;
}

export function deleteStepPhoto(uri: string): void {
  try {
    const file = new File(uri);

    if (file.exists) {
      file.delete();
    }
  } catch (error) {
    console.warn("Could not delete photo:", error);
  }
}

export async function getPlaceName(
  latitude: number,
  longitude: number,
): Promise<string | null> {
  try {
    const addresses = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    if (addresses.length === 0) {
      return null;
    }

    const address = addresses[0];

    const city = address.city ?? address.subregion ?? address.region;

    const country = address.country;

    const placeName = [city, country].filter(Boolean).join(", ");

    return placeName || null;
  } catch (error) {
    console.warn("Reverse geocoding failed:", error);
    return null;
  }
}
