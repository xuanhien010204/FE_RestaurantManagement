export type PromotionStatus = "Active" | "Expired";

export interface Promotion {
    id: number;
    code: string;
    description?: string;
    discount: number;
    startDate: string;
    endDate: string;
    status: PromotionStatus;
}
