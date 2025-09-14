import type { User } from "./User";
import type { Order } from "./Order";
import type { MenuItem } from "./MenuItem";

export interface Feedback {
    id: number;
    userId: number;
    orderId?: number;
    menuItemId?: number;
    rating: number;
    comment?: string;
    isApproved: boolean;
    createdAt: string;
    updatedAt?: string;
    reply?: string;
    repliedAt?: string;
    user?: User;
    order?: Order;
    menuItem?: MenuItem;
}
