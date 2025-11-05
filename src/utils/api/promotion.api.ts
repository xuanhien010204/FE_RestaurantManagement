import axios from "../axios";

export type PromotionCreateDto = {
    code: string;
    description?: string;
    discount: number; // 0-100
    startDate: string;
    endDate: string;
};

export const createPromotion = (payload: PromotionCreateDto) => axios.post("/promotion", payload);
export const updatePromotion = (id: number, payload: PromotionCreateDto) => axios.put(`/promotion/${id}`, payload);
export const deletePromotion = (id: number) => axios.delete(`/promotion/${id}`);
export const searchPromotions = (keyword: string) => axios.get(`/promotion/search?keyword=${encodeURIComponent(keyword)}`);
export const applyPromotionCode = (code: string) => axios.get(`/promotion/apply/${encodeURIComponent(code)}`);
export const getPromotionById = (id: number) => axios.get(`/promotion/${id}`);