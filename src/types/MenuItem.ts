import type { OrderDetail } from "./Order";

export type MenuItemStatus = "Available" | "OutOfStock";

export interface MenuItemImage {
    id: number;
    imageUrl: string;
    menuItemId: number;
    menuItem?: MenuItem;
}

export interface MenuItem {
    id: number;
    name: string;
    description?: string;
    price: number;
    category?: string;
    status: MenuItemStatus;
    images?: MenuItemImage[];
    orderDetails?: OrderDetail[];
}
