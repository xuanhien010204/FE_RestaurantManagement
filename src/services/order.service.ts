import * as orderApi from "../utils/api/order.api";
import type { Order } from "../types/Order";
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

const OrderStatusMap: Record<number, Order["status"]> = {
    0: "Pending",
    1: "InProgress",
    2: "Completed",
    3: "Cancelled"
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
    const data = extractData(response) as { status: number };
    return {
        status: OrderStatusMap[Number(data.status ?? 0)] ?? "Pending"
    };
};

export const updateOrderStatus = async (id: number, status: Order["status"]): Promise<void> => {
    const statusValue = Object.entries(OrderStatusMap).find(([, v]) => v === status)?.[0];
    if (statusValue === undefined) {
        throw new Error(`Invalid status: ${status}`);
    }
    await orderApi.updateOrderStatus(id, Number(statusValue));
};

// Map backend order DTO to frontend Order type
const mapBackendOrderToFrontend = (raw: unknown): Order => {
    const backendOrder = raw as Record<string, unknown>;

    return {
        id: Number(backendOrder.id ?? 0),
        userId: Number(backendOrder.userId ?? 0),
        tableId: Number(backendOrder.tableId ?? 0),
        orderTime: String(backendOrder.orderTime ?? new Date().toISOString()),
        status: OrderStatusMap[Number(backendOrder.status ?? 0)] ?? "Pending",
        totalAmount: Number(backendOrder.totalAmount ?? 0),
        orderDetails: Array.isArray(backendOrder.items)
            ? backendOrder.items.map((item: Record<string, unknown>) => ({
                id: Number(item.id ?? 0),
                orderId: Number(backendOrder.id ?? 0),
                menuItemId: Number(item.menuItemId ?? 0),
                quantity: Number(item.quantity ?? 0),
                price: Number(item.price ?? 0),
                menuItem: item.menuItem ? {
                    id: Number((item.menuItem as Record<string, unknown>).id ?? 0),
                    name: String((item.menuItem as Record<string, unknown>).name ?? ""),
                    description: (item.menuItem as Record<string, unknown>).description as string | undefined,
                    price: Number((item.menuItem as Record<string, unknown>).price ?? 0),
                    category: (item.menuItem as Record<string, unknown>).category as string | undefined,
                    status: "Available" as const,
                } : undefined
            }))
            : [],
    };
};