import * as staffApi from "../utils/api/staff.api";
import type { StaffProfile } from "../types/StaffProfile";
import { extractData, extractArrayData, extractPaginatedData } from "../utils/response-mapper";

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
    return extractData(response);
};

export const getAllStaff = async (): Promise<StaffProfile[]> => {
    const response = await staffApi.getAllStaff();
    const staff = extractArrayData(response);
    return staff.map(mapBackendStaffToFrontend);
};

export const getPaginatedStaff = async (page: number = 1, pageSize: number = 10) => {
    const response = await staffApi.getPaginatedStaff(page, pageSize);
    const paginatedData = extractPaginatedData(response, page, pageSize);
    return {
        ...paginatedData,
        items: paginatedData.items.map(mapBackendStaffToFrontend)
    };
};

export const getStaffById = async (id: number): Promise<StaffProfile> => {
    const response = await staffApi.getStaffById(id);
    return mapBackendStaffToFrontend(extractData(response));
};

export const updateStaff = async (id: number, payload: StaffCreateRequest) => {
    const response = await staffApi.updateStaff(id, payload);
    return extractData(response);
};

export const deleteStaff = async (id: number) => {
    const response = await staffApi.deleteStaff(id);
    return extractData(response);
};

export const searchStaff = async (keyword: string): Promise<StaffProfile[]> => {
    const response = await staffApi.searchStaff(keyword);
    const staff = extractArrayData(response);
    return staff.map(mapBackendStaffToFrontend);
};

export const searchPaginatedStaff = async (keyword: string, page: number = 1, pageSize: number = 10) => {
    const response = await staffApi.searchPaginatedStaff(keyword, page, pageSize);
    const paginatedData = extractPaginatedData(response, page, pageSize);
    return {
        ...paginatedData,
        items: paginatedData.items.map(mapBackendStaffToFrontend)
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