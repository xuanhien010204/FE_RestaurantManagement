import * as customerApi from "../utils/api/customer.api";
import type { User } from "../types/User";
import { extractData, extractArrayData, extractPaginatedData } from "../utils/response-mapper";

export interface CustomerCreateRequest {
    fullName: string;
    email?: string;
    phone?: string;
    address?: string;
}

const UserStatusMap: Record<number, User["status"]> = {
    0: "Active",
    1: "Inactive",
    2: "Suspended"
};

export const createCustomer = async (payload: CustomerCreateRequest) => {
    const response = await customerApi.createCustomer(payload);
    return extractData(response);
};

export const getAllCustomers = async (): Promise<User[]> => {
    const response = await customerApi.getAllCustomers();
    const customers = extractArrayData(response);
    return customers.map(mapBackendCustomerToFrontend);
};

export const getPaginatedCustomers = async (page: number = 1, pageSize: number = 10) => {
    const response = await customerApi.getPaginatedCustomers(page, pageSize);
    const paginatedData = extractPaginatedData(response, page, pageSize);
    return {
        ...paginatedData,
        items: paginatedData.items.map(mapBackendCustomerToFrontend)
    };
};

export const getCustomerById = async (id: number): Promise<User> => {
    const response = await customerApi.getCustomerById(id);
    return mapBackendCustomerToFrontend(extractData(response));
};

export const updateCustomer = async (id: number, payload: CustomerCreateRequest) => {
    const response = await customerApi.updateCustomer(id, payload);
    return extractData(response);
};

export const deleteCustomer = async (id: number) => {
    const response = await customerApi.deleteCustomer(id);
    return extractData(response);
};

export const searchCustomers = async (keyword: string): Promise<User[]> => {
    const response = await customerApi.searchCustomers(keyword);
    const customers = extractArrayData(response);
    return customers.map(mapBackendCustomerToFrontend);
};

export const searchPaginatedCustomers = async (keyword: string, page: number = 1, pageSize: number = 10) => {
    const response = await customerApi.searchPaginatedCustomers(keyword, page, pageSize);
    const paginatedData = extractPaginatedData(response, page, pageSize);
    return {
        ...paginatedData,
        items: paginatedData.items.map(mapBackendCustomerToFrontend)
    };
};

// Map backend customer DTO to frontend User type
const mapBackendCustomerToFrontend = (raw: unknown): User => {
    const backendCustomer = raw as Record<string, unknown>;

    return {
        id: Number(backendCustomer.id ?? 0),
        fullName: String(backendCustomer.fullName ?? ""),
        email: String(backendCustomer.email ?? ""),
        passwordHash: "",
        phone: backendCustomer.phone as string | undefined,
        address: backendCustomer.address as string | undefined,
        role: "Customer",
        status: UserStatusMap[Number(backendCustomer.status ?? 0)] ?? "Active",
        createdAt: String(backendCustomer.createdAt ?? new Date().toISOString()),
        updatedAt: backendCustomer.updatedAt as string | undefined,
        isDeleted: Boolean(backendCustomer.isDeleted ?? false),
    };
};