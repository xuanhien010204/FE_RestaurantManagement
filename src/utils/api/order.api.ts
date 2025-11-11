import axios from "../axios";

export type OrderCreateRequest = {
    tableId: number;
    items: {
        menuItemId: number;
        quantity: number;
    }[];
};

export type OrderUpdateRequest = {
    items: {
        menuItemId: number;
        quantity: number;
    }[];
};

export const createOrder = (payload: OrderCreateRequest) => axios.post("/order", payload);
export const getAllOrders = () => axios.get("/order");
export const getPaginatedOrders = (page: number = 1, pageSize: number = 10) =>
    axios.get(`/order/paginated?page=${page}&pageSize=${pageSize}`);
export const getOrderById = (id: number) => axios.get(`/order/${id}`);
export const searchOrders = (keyword: string) => axios.get(`/order/search?keyword=${encodeURIComponent(keyword)}`);
export const searchPaginatedOrders = (keyword: string, page: number = 1, pageSize: number = 10) =>
    axios.get(`/order/search/paginated?keyword=${encodeURIComponent(keyword)}&page=${page}&pageSize=${pageSize}`);
export const updateOrder = (id: number, payload: OrderUpdateRequest) => axios.put(`/order/${id}`, payload);
export const cancelOrder = (id: number) => axios.put(`/order/${id}/cancel`);
export const getOrderStatus = (id: number) => axios.get(`/order/${id}/status`);
export const updateOrderStatus = (id: number, status: number) => axios.put(`/order/${id}/status`, { status });