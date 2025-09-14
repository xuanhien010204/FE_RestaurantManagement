import type { Order } from "./Order";

export type PaymentMethod =
    | "Cash"
    | "CreditCard"
    | "BankTransfer"
    | "EWallet"
    | "Voucher";

export type PaymentStatus = "Pending" | "Completed" | "Failed";

export interface PaymentDetail {
    id: number;
    paymentId: number;
    payment?: Payment;
    method: PaymentMethod;
    amount: number;
    transactionCode?: string;
    provider?: string;
    extraInfo?: string;
}

export interface Payment {
    id: number;
    orderId: number;
    order?: Order;
    amount: number;
    status: PaymentStatus;
    paymentDate: string;
    paymentDetails?: PaymentDetail[];
}
