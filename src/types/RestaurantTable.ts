import type { Reservation } from "./Reservation";
import type { Order } from "./Order";

export type TableStatus = "Available" | "Occupied" | "Reserved";

export interface RestaurantTable {
    id: number;
    tableNumber: number;
    seats: number;
    status: TableStatus;
    location?: string;
    reservations?: Reservation[];
    orders?: Order[];
}
