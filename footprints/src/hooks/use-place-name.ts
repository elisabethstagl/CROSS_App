import { useEffect, useState } from "react";
import { getPlaceName } from "@/services/nativeFeatures";

type ResolvedPlace = {
  latitude: number;
  longitude: number;
  name: string | null;
};

export function usePlaceName(
  latitude: number | undefined,
  longitude: number | undefined,
) {
  const [place, setPlace] = useState<ResolvedPlace | null>(null);

  useEffect(() => {
    if (latitude == null || longitude == null) return;

    let active = true;

    void getPlaceName(latitude, longitude).then((name) => {
      if (active) {
        setPlace({ latitude, longitude, name });
      }
    });

    return () => {
      active = false;
    };
  }, [latitude, longitude]);

  if (
    latitude == null ||
    longitude == null ||
    !place ||
    place.latitude !== latitude ||
    place.longitude !== longitude
  ) {
    return null;
  }

  return place.name;
}
