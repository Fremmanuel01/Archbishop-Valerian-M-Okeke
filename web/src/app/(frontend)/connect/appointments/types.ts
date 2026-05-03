export type BookingState = {
  ok: boolean;
  error: string | null;
};

export const initialBookingState: BookingState = {
  ok: false,
  error: null,
};
