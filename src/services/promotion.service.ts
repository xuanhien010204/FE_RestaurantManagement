import * as promotionApi from "../utils/api/promotion.api";
import type { Promotion } from "../types/Promotion";
import { extractData, extractArrayData } from "../utils/response-mapper";

export interface PromotionCreateRequest {
    code: string;
    description?: string;
    discount: number; // 0-100
    startDate: string;
    endDate: string;
}

const PromotionStatusMap: Record<number, Promotion["status"]> = {
    0: "Active",
    1: "Expired"
};

export const createPromotion = async (payload: PromotionCreateRequest): Promise<Promotion> => {
    const response = await promotionApi.createPromotion(payload);
    return mapBackendPromotionToFrontend(extractData(response));
};

export const updatePromotion = async (id: number, payload: PromotionCreateRequest): Promise<Promotion> => {
    const response = await promotionApi.updatePromotion(id, payload);
    return mapBackendPromotionToFrontend(extractData(response));
};

export const deletePromotion = async (id: number) => {
    const response = await promotionApi.deletePromotion(id);
    return extractData(response);
};

export const searchPromotions = async (keyword: string): Promise<Promotion[]> => {
    const response = await promotionApi.searchPromotions(keyword);
    const promotions = extractArrayData(response);
    return promotions.map(mapBackendPromotionToFrontend);
};

export const applyPromotionCode = async (code: string): Promise<Promotion> => {
    const response = await promotionApi.applyPromotionCode(code);
    return mapBackendPromotionToFrontend(extractData(response));
};

export const getPromotionById = async (id: number): Promise<Promotion> => {
    const response = await promotionApi.getPromotionById(id);
    return mapBackendPromotionToFrontend(extractData(response));
};

// Map backend promotion DTO to frontend Promotion type
const mapBackendPromotionToFrontend = (raw: unknown): Promotion => {
    const backendPromotion = raw as Record<string, unknown>;

    return {
        id: Number(backendPromotion.id ?? 0),
        code: String(backendPromotion.code ?? ""),
        description: backendPromotion.description as string | undefined,
        discount: Number(backendPromotion.discount ?? 0),
        startDate: String(backendPromotion.startDate ?? new Date().toISOString()),
        endDate: String(backendPromotion.endDate ?? new Date().toISOString()),
        status: PromotionStatusMap[Number(backendPromotion.status ?? 0)] ?? "Active",
    };
};