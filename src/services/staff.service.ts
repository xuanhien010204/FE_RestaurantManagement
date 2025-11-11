import * as staffApi from "../utils/api/staff.api";
import type { StaffProfile } from "../types/StaffProfile";

export interface StaffCreateRequest {
    fullName: string;
    email: string;
    password?: string;
    phone?: string;
    address?: string;
    position: string;
    hireDate?: string;
}

export const createStaff = async (payload: StaffCreateRequest) => {
    const response = await staffApi.createStaff(payload);
    return response.data;
};

export const getAllStaff = async (): Promise<StaffProfile[]> => {
    const response = await staffApi.getAllStaff();
    return response.data.map(mapBackendStaffToFrontend);
};

export const getPaginatedStaff = async (page: number = 1, pageSize: number = 10) => {
    const response = await staffApi.getPaginatedStaff(page, pageSize);
    return {
        items: response.data.items?.map(mapBackendStaffToFrontend) ?? [],
        totalItems: response.data.totalItems ?? 0,
        totalPages: response.data.totalPages ?? 0,
        currentPage: response.data.currentPage ?? page,
        pageSize: response.data.pageSize ?? pageSize,
    };
};

export const getStaffById = async (id: number): Promise<StaffProfile> => {
    const response = await staffApi.getStaffById(id);
    return mapBackendStaffToFrontend(response.data);
};

export const updateStaff = async (id: number, payload: StaffCreateRequest) => {
    const response = await staffApi.updateStaff(id, payload);
    return response.data;
};

export const deleteStaff = async (id: number) => {
    const response = await staffApi.deleteStaff(id);
    return response.data;
};

export const searchStaff = async (keyword: string): Promise<StaffProfile[]> => {
    const response = await staffApi.searchStaff(keyword);
    return response.data.map(mapBackendStaffToFrontend);
};

export const searchPaginatedStaff = async (keyword: string, page: number = 1, pageSize: number = 10) => {
    const response = await staffApi.searchPaginatedStaff(keyword, page, pageSize);
    return {
        items: response.data.items?.map(mapBackendStaffToFrontend) ?? [],
        totalItems: response.data.totalItems ?? 0,
        totalPages: response.data.totalPages ?? 0,
        currentPage: response.data.currentPage ?? page,
        pageSize: response.data.pageSize ?? pageSize,
    };
};

// Map backend staff DTO to frontend StaffProfile type
const mapBackendStaffToFrontend = (raw: unknown): StaffProfile => {
    const backendStaff = raw as Record<string, unknown>;

    return {
        id: Number(backendStaff.id ?? 0),
        userId: Number(backendStaff.userId ?? 0),
        position: String(backendStaff.position ?? ""),
        hireDate: String(backendStaff.hireDate ?? new Date().toISOString()),
        user: {
            id: Number(backendStaff.id ?? 0),
            fullName: String(backendStaff.fullName ?? ""),
            email: String(backendStaff.email ?? ""),
            passwordHash: "",
            phone: backendStaff.phone as string | undefined,
            address: backendStaff.address as string | undefined,
            role: "Staff",
            status: "Active",
            createdAt: String(backendStaff.createdAt ?? new Date().toISOString()),
            updatedAt: backendStaff.updatedAt as string | undefined,
            isDeleted: Boolean(backendStaff.isDeleted ?? false),
        }
    };
};