import * as orderApi from "../utils/api/order.api";
import type { Order, OrderDetail } from "../types/Order";
import type { MenuItem } from "../types/MenuItem";
import { extractData, extractArrayData } from "../utils/response-mapper";

export interface OrderCreateRequest {
    tableId: number | 0;
    items: {
        menuItemId: number;
        quantity: number;
    }[];
}

export interface OrderUpdateRequest {
    items: {
        menuItemId: number;
        quantity: number;
    }[];
}

const ORDER_STATUSES: Order["status"][] = ["Pending", "InProgress", "Completed", "Cancelled"];
const STATUS_BY_NUMBER: Record<number, Order["status"]> = {
    0: "Pending",
    1: "InProgress",
    2: "Completed",
    3: "Cancelled",
};
const STATUS_BY_STRING = ORDER_STATUSES.reduce<Record<string, Order["status"]>>((acc, status) => {
    acc[status.toLowerCase()] = status;
    return acc;
}, {});

const normalizeOrderStatus = (value: unknown): Order["status"] => {
    if (typeof value === "string") {
        const trimmed = value.trim();
        if (!trimmed) return "Pending";

        const lowerKey = trimmed.toLowerCase();
        if (STATUS_BY_STRING[lowerKey]) {
            return STATUS_BY_STRING[lowerKey];
        }

        const maybeNumber = Number(trimmed);
        if (Number.isFinite(maybeNumber)) {
            return STATUS_BY_NUMBER[maybeNumber] ?? "Pending";
        }
        return "Pending";
    }

    if (typeof value === "number") {
        return STATUS_BY_NUMBER[value] ?? "Pending";
    }

    return "Pending";
};

export const createOrder = async (payload: OrderCreateRequest) => {
    const response = await orderApi.createOrder(payload);
    return extractData(response);
};

export const getAllOrders = async (): Promise<Order[]> => {
    const response = await orderApi.getAllOrders();
    const orders = extractArrayData(response);
    return orders.map(mapBackendOrderToFrontend);
};

export const getOrderById = async (id: number): Promise<Order> => {
    const response = await orderApi.getOrderById(id);
    return mapBackendOrderToFrontend(extractData(response));
};

export const searchOrders = async (keyword: string): Promise<Order[]> => {
    const response = await orderApi.searchOrders(keyword);
    const orders = extractArrayData(response);
    return orders.map(mapBackendOrderToFrontend);
};

export const updateOrder = async (id: number, payload: OrderUpdateRequest) => {
    const response = await orderApi.updateOrder(id, payload);
    return extractData(response);
};

export const cancelOrder = async (id: number) => {
    const response = await orderApi.cancelOrder(id);
    return extractData(response);
};

export const getOrderStatus = async (id: number): Promise<{ status: Order["status"] }> => {
    const response = await orderApi.getOrderStatus(id);
    const data = extractData(response) as { status?: string | number };
    return {
        status: normalizeOrderStatus(data?.status)
    };
};

export const updateOrderStatus = async (id: number, status: Order["status"]): Promise<void> => {
    if (!ORDER_STATUSES.includes(status)) {
        throw new Error(`Invalid status: ${status}`);
    }
    await orderApi.updateOrderStatus(id, { status });
};

// Map backend order DTO to frontend Order type
const mapBackendOrderToFrontend = (raw: unknown): Order => {
    const backendOrder = raw as Record<string, unknown>;
    const orderId = Number(backendOrder.id ?? 0);
    const orderDetails = Array.isArray(backendOrder.items)
        ? backendOrder.items.map((item, index) => mapBackendOrderDetail(orderId, item, index))
        : [];
    const fallbackTotal = orderDetails.reduce((sum, detail) => sum + detail.quantity * detail.price, 0);

    return {
        id: orderId,
        userId: Number(backendOrder.userId ?? 0),
        tableId: Number(backendOrder.tableId ?? 0),
        orderTime: String(backendOrder.orderTime ?? new Date().toISOString()),
        status: normalizeOrderStatus(backendOrder.status),
        totalAmount: Number(backendOrder.totalAmount ?? fallbackTotal),
        orderDetails,
    };
};

const mapBackendOrderDetail = (orderId: number, rawItem: unknown, index: number): OrderDetail => {
    const item = rawItem as Record<string, unknown>;
    const quantity = Number(item.quantity ?? 0);
    const price = Number(item.price ?? 0);
    const menuItemId = Number(item.menuItemId ?? 0);

    return {
        id: Number(item.id ?? index + 1),
        orderId,
        menuItemId,
        quantity,
        price,
        menuItem: resolveMenuItem(item, menuItemId, price),
    };
};

const resolveMenuItem = (item: Record<string, unknown>, menuItemId: number, price: number): MenuItem | undefined => {
    if (item.menuItem) {
        const nested = item.menuItem as Record<string, unknown>;
        return {
            id: Number(nested.id ?? menuItemId),
            name: String(nested.name ?? ""),
            description: nested.description as string | undefined,
            price: Number(nested.price ?? price),
            category: nested.category as string | undefined,
            status: "Available",
            images: (nested.images as MenuItem["images"]) ?? [],
        };
    }

    const name = item.menuItemName ? String(item.menuItemName) : undefined;
    if (!name) {
        return undefined;
    }

    return {
        id: menuItemId,
        name,
        description: undefined,
        price,
        category: undefined,
        status: "Available",
        images: [],
    };
};
