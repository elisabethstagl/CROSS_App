export type Step = {
  id: string;
  tripId: string;

  note: string;
  date: string;

  latitude?: number;
  longitude?: number;

  photoUri?: string;
};