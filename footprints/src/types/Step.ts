export type Step = {
  id: string;
  tripId: string;
  name: string;

  note: string;
  date: string;

  latitude?: number;
  longitude?: number;

  photoUri?: string;
};
