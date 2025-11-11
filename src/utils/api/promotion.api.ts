import axios from "../axios";

export type PromotionCreateDto = {
    code: string;
    description?: string;
    discount: number; // 0-100
    startDate: string;
    endDate: string;
};

export const getAllPromotions = () => axios.get("/promotion");
export const getPaginatedPromotions = (page: number = 1, pageSize: number = 10) =>
    axios.get(`/promotion/paginated?page=${page}&pageSize=${pageSize}`);
export const createPromotion = (payload: PromotionCreateDto) => axios.post("/promotion", payload);
export const updatePromotion = (id: number, payload: PromotionCreateDto) => axios.put(`/promotion/${id}`, payload);
export const deletePromotion = (id: number) => axios.delete(`/promotion/${id}`);
export const searchPromotions = (keyword: string) => axios.get(`/promotion/search?keyword=${encodeURIComponent(keyword)}`);
export const searchPaginatedPromotions = (keyword: string, page: number = 1, pageSize: number = 10) =>
    axios.get(`/promotion/search/paginated?keyword=${encodeURIComponent(keyword)}&page=${page}&pageSize=${pageSize}`);
export const applyPromotionCode = (code: string) => axios.get(`/promotion/apply/${encodeURIComponent(code)}`);
export const getPromotionById = (id: number) => axios.get(`/promotion/${id}`);