import * as paymentApi from "../utils/api/payment.api";
import type { Payment, PaymentStatistics, PaymentMethod, PaymentStatus } from "../types/Payment";

export interface PaymentDetailCreateRequest {
    method: number; // 0=Cash, 1=CreditCard, 2=BankTransfer, 3=EWallet, 4=Voucher
    amount: number;
    transactionCode?: string;
    provider?: string;
    extraInfo?: string;
}

export interface PaymentCreateRequest {
    orderId: number;
    amount: number;
    paymentDetails: PaymentDetailCreateRequest[];
}

const PaymentMethodMap: Record<number, PaymentMethod> = {
    0: "Cash",
    1: "CreditCard",
    2: "BankTransfer",
    3: "EWallet",
    4: "Voucher"
};

const PaymentStatusMap: Record<number, PaymentStatus> = {
    0: "Pending",
    1: "Completed",
    2: "Failed"
};

export const createPayment = async (payload: PaymentCreateRequest) => {
    const response = await paymentApi.createPayment(payload);
    return response.data;
};

export const getAllPayments = async (): Promise<Payment[]> => {
    const response = await paymentApi.getAllPayments();
    return response.data.map(mapBackendPaymentToFrontend);
};

export const getPaymentById = async (id: number): Promise<Payment> => {
    const response = await paymentApi.getPaymentById(id);
    return mapBackendPaymentToFrontend(response.data);
};

export const getPaymentsByOrderId = async (orderId: number): Promise<Payment[]> => {
    const response = await paymentApi.getPaymentsByOrderId(orderId);
    return response.data.map(mapBackendPaymentToFrontend);
};

export const getPaymentsByStatus = async (status: number): Promise<Payment[]> => {
    const response = await paymentApi.getPaymentsByStatus(status);
    return response.data.map(mapBackendPaymentToFrontend);
};

export const updatePaymentStatus = async (id: number, status: number) => {
    const response = await paymentApi.updatePaymentStatus(id, { paymentId: id, status });
    return response.data;
};

export const deletePayment = async (id: number) => {
    const response = await paymentApi.deletePayment(id);
    return response.data;
};

export const searchPaymentsByTransactionCode = async (transactionCode: string): Promise<Payment[]> => {
    const response = await paymentApi.searchPaymentsByTransactionCode(transactionCode);
    return response.data.map(mapBackendPaymentToFrontend);
};

export const getPaymentsByDateRange = async (startDate: string, endDate: string): Promise<Payment[]> => {
    const response = await paymentApi.getPaymentsByDateRange(startDate, endDate);
    return response.data.map(mapBackendPaymentToFrontend);
};

export const getTotalRevenue = async (): Promise<number> => {
    const response = await paymentApi.getTotalRevenue();
    return response.data.totalRevenue;
};

export const getPaymentStatistics = async (): Promise<PaymentStatistics> => {
    const response = await paymentApi.getPaymentStatistics();
    return response.data;
};

export const verifyPayment = async (id: number, transactionCode: string) => {
    const response = await paymentApi.verifyPayment(id, { transactionCode });
    return response.data;
};

// Map backend payment DTO to frontend Payment type
const mapBackendPaymentToFrontend = (raw: unknown): Payment => {
    const backendPayment = raw as Record<string, unknown>;

    return {
        id: Number(backendPayment.id ?? 0),
        orderId: Number(backendPayment.orderId ?? 0),
        amount: Number(backendPayment.amount ?? 0),
        status: PaymentStatusMap[Number(backendPayment.status ?? 0)] ?? "Pending",
        paymentDate: String(backendPayment.paymentDate ?? new Date().toISOString()),
        paymentDetails: Array.isArray(backendPayment.paymentDetails)
            ? backendPayment.paymentDetails.map((detail: Record<string, unknown>) => ({
                id: Number(detail.id ?? 0),
                paymentId: Number(detail.paymentId ?? 0),
                method: PaymentMethodMap[Number(detail.method ?? 0)] ?? "Cash",
                amount: Number(detail.amount ?? 0),
                transactionCode: detail.transactionCode as string | undefined,
                provider: detail.provider as string | undefined,
                extraInfo: detail.extraInfo as string | undefined,
            }))
            : [],
    };
};