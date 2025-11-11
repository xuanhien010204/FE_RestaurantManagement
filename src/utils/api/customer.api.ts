import axios from "../axios";

export type CustomerCreateRequest = {
    fullName: string;
    email?: string;
    phone?: string;
    address?: string;
};

export type CustomerResponse = {
    success: boolean;
    message: string;
    customer: {
        id: number;
        fullName: string;
        email: string;
        phone: string;
        address: string;
        role: string;
        status: string;
        createdAt: string;
        updatedAt: string;
        isDeleted: boolean;
    };
};

export const createCustomer = (payload: CustomerCreateRequest) => axios.post<CustomerResponse>("/customer", payload);
export const getAllCustomers = () => axios.get("/customer");
export const getPaginatedCustomers = (page: number = 1, pageSize: number = 10) =>
    axios.get(`/customer/paginated?page=${page}&pageSize=${pageSize}`);
export const getCustomerById = (id: number) => axios.get(`/customer/${id}`);
export const updateCustomer = (id: number, payload: CustomerCreateRequest) => axios.put(`/customer/${id}`, payload);
export const deleteCustomer = (id: number) => axios.delete(`/customer/${id}`);
export const searchCustomers = (keyword: string) => axios.get(`/customer/search?keyword=${encodeURIComponent(keyword)}`);
export const searchPaginatedCustomers = (keyword: string, page: number = 1, pageSize: number = 10) =>
    axios.get(`/customer/search/paginated?keyword=${encodeURIComponent(keyword)}&page=${page}&pageSize=${pageSize}`);