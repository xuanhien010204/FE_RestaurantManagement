import * as feedbackApi from "../utils/api/feedback.api";
import type { Feedback } from "../types/Feedback";
import { extractData, extractArrayData } from "../utils/response-mapper";

export interface CreateFeedbackRequest {
    userId: number;
    orderId?: number;
    menuItemId?: number;
    rating: number; // 1-5
    isApproved: boolean;
    comment?: string;
}

export interface FeedbackUpdateRequest {
    id: number;
    rating?: number; // 1-5
    comment?: string;
    isApproved?: boolean;
    reply?: string;
    repliedAt?: string;
}

export const getAllFeedbacks = async (): Promise<Feedback[]> => {
    const response = await feedbackApi.getAllFeedbacks();
    const feedbacks = extractArrayData(response);
    return feedbacks.map(mapBackendFeedbackToFrontend);
};

export const getFeedbackById = async (id: number): Promise<Feedback> => {
    const response = await feedbackApi.getFeedbackById(id);
    return mapBackendFeedbackToFrontend(extractData(response));
};

export const createFeedback = async (payload: CreateFeedbackRequest): Promise<Feedback> => {
    const response = await feedbackApi.createFeedback(payload);
    return mapBackendFeedbackToFrontend(extractData(response));
};

export const updateFeedback = async (id: number, payload: FeedbackUpdateRequest): Promise<Feedback> => {
    const response = await feedbackApi.updateFeedback(id, payload);
    return mapBackendFeedbackToFrontend(extractData(response));
};

export const updateOwnFeedback = async (payload: FeedbackUpdateRequest): Promise<Feedback> => {
    const response = await feedbackApi.updateOwnFeedback(payload);
    return mapBackendFeedbackToFrontend(extractData(response));
};

export const deleteFeedback = async (id: number) => {
    const response = await feedbackApi.deleteFeedback(id);
    return extractData(response);
};

// Map backend feedback DTO to frontend Feedback type
const mapBackendFeedbackToFrontend = (raw: unknown): Feedback => {
    const backendFeedback = raw as Record<string, unknown>;

    return {
        id: Number(backendFeedback.id ?? 0),
        userId: Number(backendFeedback.userId ?? 0),
        orderId: backendFeedback.orderId ? Number(backendFeedback.orderId) : undefined,
        menuItemId: backendFeedback.menuItemId ? Number(backendFeedback.menuItemId) : undefined,
        rating: Number(backendFeedback.rating ?? 1),
        comment: backendFeedback.comment as string | undefined,
        isApproved: Boolean(backendFeedback.isApproved ?? false),
        createdAt: String(backendFeedback.createdAt ?? new Date().toISOString()),
        updatedAt: backendFeedback.updatedAt as string | undefined,
        reply: backendFeedback.reply as string | undefined,
        repliedAt: backendFeedback.repliedAt as string | undefined,
        user: backendFeedback.user ? {
            id: Number((backendFeedback.user as Record<string, unknown>).id ?? 0),
            fullName: String((backendFeedback.user as Record<string, unknown>).fullName ?? ""),
            email: String((backendFeedback.user as Record<string, unknown>).email ?? ""),
            passwordHash: "",
            role: "Customer",
            status: "Active",
            createdAt: String((backendFeedback.user as Record<string, unknown>).createdAt ?? new Date().toISOString()),
            isDeleted: false,
        } : undefined,
    };
};