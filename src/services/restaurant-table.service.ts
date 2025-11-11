import * as tableApi from "../utils/api/restaurant-table.api";
import type { RestaurantTable } from "../types/RestaurantTable";
import { extractData, extractArrayData } from "../utils/response-mapper";

export interface RestaurantTableCreateRequest {
    tableNumber: number;
    seats: number;
    status: number; // 0=Available, 1=Occupied, 2=Reserved
    location: string;
}

const TableStatusMap: Record<number, RestaurantTable["status"]> = {
    0: "Available",
    1: "Occupied",
    2: "Reserved"
};

export const getTableById = async (id: number): Promise<RestaurantTable> => {
    const response = await tableApi.getTableById(id);
    return mapBackendTableToFrontend(extractData(response));
};

export const getAllTables = async (): Promise<RestaurantTable[]> => {
    const response = await tableApi.getAllTables();
    const tables = extractArrayData(response);
    return tables.map(mapBackendTableToFrontend);
};

export const getAllTablesAvailable = async (): Promise<RestaurantTable[]> => {
    const response = await tableApi.getAllTablesAvailable();
    const tables = extractArrayData(response);
    return tables.map(mapBackendTableToFrontend);
};

export const searchTablesByNumber = async (tableNumber: number): Promise<RestaurantTable[]> => {
    const response = await tableApi.searchTablesByNumber(tableNumber);
    const tables = extractArrayData(response);
    return tables.map(mapBackendTableToFrontend);
};

export const createTable = async (payload: RestaurantTableCreateRequest): Promise<RestaurantTable> => {
    const response = await tableApi.createTable(payload);
    return mapBackendTableToFrontend(extractData(response));
};

export const updateTable = async (id: number, payload: RestaurantTableCreateRequest): Promise<void> => {
    await tableApi.updateTable(id, payload);
};

export const deleteTable = async (id: number): Promise<void> => {
    await tableApi.deleteTable(id);
};

export const reserveTable = async (id: number): Promise<void> => {
    await tableApi.reserveTable(id);
};

export const cancelTableReservation = async (id: number): Promise<void> => {
    await tableApi.cancelTableReservation(id);
};

// Map backend table DTO to frontend RestaurantTable type
const mapBackendTableToFrontend = (raw: unknown): RestaurantTable => {
    const backendTable = raw as Record<string, unknown>;

    return {
        id: Number(backendTable.id ?? 0),
        tableNumber: Number(backendTable.tableNumber ?? 0),
        seats: Number(backendTable.seats ?? 0),
        status: TableStatusMap[Number(backendTable.status ?? 0)] ?? "Available",
        location: String(backendTable.location ?? ""),
    };
};