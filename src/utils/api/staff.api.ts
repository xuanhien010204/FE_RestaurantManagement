import axios from "../axios";

export type StaffCreateRequest = {
    fullName: string;
    email: string;
    password?: string;
    phone?: string;
    address?: string;
    position: string;
    hireDate?: string;
};

export type StaffResponse = {
    success: boolean;
    message: string;
    staff: {
        id: number;
        email: string;
        fullName: string;
        phone: string;
        address: string;
        role: string;
        status: string;
        createdAt: string;
        updatedAt: string;
        isDeleted: boolean;
        position: string;
        hireDate: string;
    };
};

export const createStaff = (payload: StaffCreateRequest) => axios.post<StaffResponse>("/staff", payload);
export const getAllStaff = () => axios.get("/staff");
export const getStaffById = (id: number) => axios.get(`/staff/${id}`);
export const updateStaff = (id: number, payload: StaffCreateRequest) => axios.put(`/staff/${id}`, payload);
export const deleteStaff = (id: number) => axios.delete(`/staff/${id}`);
export const searchStaff = (keyword: string) => axios.get(`/staff/search?keyword=${encodeURIComponent(keyword)}`);