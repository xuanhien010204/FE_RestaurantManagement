import axios from "../axios";

export type RestaurantTableCreateDto = {
    tableNumber: number;
    seats: number;
    status: number; // 0=Available, 1=Occupied, 2=Reserved
    location: string;
};

export const getTableById = (id: number) => axios.get(`/restaurant-table/${id}`);
export const getAllTables = () => axios.get("/restaurant-table");
export const searchTablesByNumber = (tableNumber: number) => axios.get(`/restaurant-table/search?TableNumber=${tableNumber}`);
export const createTable = (payload: RestaurantTableCreateDto) => axios.post("/restaurant-table", payload);
export const updateTable = (id: number, payload: RestaurantTableCreateDto) => axios.put(`/restaurant-table/${id}`, payload);
export const deleteTable = (id: number) => axios.delete(`/restaurant-table/${id}`);
export const reserveTable = (id: number) => axios.post(`/restaurant-table/${id}/reserve`);
export const cancelTableReservation = (id: number) => axios.post(`/restaurant-table/${id}/cancel`);