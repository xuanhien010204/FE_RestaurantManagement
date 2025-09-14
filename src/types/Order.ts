import type { User } from "./User";
import type { RestaurantTable } from "./RestaurantTable";
import type { Payment } from "./Payment";
import type { MenuItem } from "./MenuItem";

export type OrderStatus = "Pending" | "InProgress" | "Completed" | "Cancelled";

export interface OrderDetail {
    id: number;
    orderId: number;
    menuItemId: number;
    quantity: number;
    price: number;
    order?: Order;
    menuItem?: MenuItem;
}

export interface Order {
    id: number;
    userId: number;
    tableId: number;
    orderTime: string;
    status: OrderStatus;
    totalAmount: number;
    user?: User;
    table?: RestaurantTable;
    orderDetails?: OrderDetail[];
    payments?: Payment[];
}
