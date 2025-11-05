import axios from "../axios";

export type CreateFeedbackDto = {
    userId: number;
    orderId?: number;
    menuItemId?: number;
    rating: number; // 1-5
    isApproved: boolean;
    comment?: string;
};

export type FeedbackUpdateDto = {
    id: number;
    rating?: number; // 1-5
    comment?: string;
    isApproved?: boolean;
    reply?: string;
    repliedAt?: string;
};

export const getAllFeedbacks = () => axios.get("/feedback");
export const getFeedbackById = (id: number) => axios.get(`/feedback/${id}`);
export const createFeedback = (payload: CreateFeedbackDto) => axios.post("/feedback", payload);
export const updateFeedback = (id: number, payload: FeedbackUpdateDto) => axios.put(`/feedback/${id}`, payload);
export const updateOwnFeedback = (payload: FeedbackUpdateDto) => axios.put("/feedback/customer", payload);
export const deleteFeedback = (id: number) => axios.delete(`/feedback/${id}`);