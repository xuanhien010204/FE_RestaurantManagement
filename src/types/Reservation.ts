import type { User } from "./User";
import type { RestaurantTable } from "./RestaurantTable";

export type ReservationStatus = "Pending" | "Confirmed" | "Cancelled";

export interface Reservation {
    id: number;
    userId: number;
    tableId: number;
    reservationTime: string;
    numberOfGuests: number;
    status: ReservationStatus;
    user?: User;
    table?: RestaurantTable;
}
