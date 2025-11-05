import axios from "../axios";

export type PaymentDetailCreateDto = {
    method: number; // 0=Cash, 1=CreditCard, 2=BankTransfer, 3=EWallet, 4=Voucher
    amount: number;
    transactionCode?: string;
    provider?: string;
    extraInfo?: string;
};

export type PaymentCreateDto = {
    orderId: number;
    amount: number;
    paymentDetails: PaymentDetailCreateDto[];
};

export type PaymentStatusUpdateDto = {
    paymentId: number;
    status: number; // 0=Pending, 1=Completed, 2=Failed
};

export type VerifyPaymentDto = {
    transactionCode: string;
};

// Create payment
export const createPayment = (payload: PaymentCreateDto) => axios.post("/payment", payload);

// Get all payments (Admin/Staff)
export const getAllPayments = () => axios.get("/payment");

// Get payment by ID
export const getPaymentById = (id: number) => axios.get(`/payment/${id}`);

// Get payments by order ID
export const getPaymentsByOrderId = (orderId: number) => axios.get(`/payment/order/${orderId}`);

// Get payments by status (Admin/Staff)
export const getPaymentsByStatus = (status: number) => axios.get(`/payment/status/${status}`);

// Update payment status (Admin)
export const updatePaymentStatus = (id: number, payload: PaymentStatusUpdateDto) =>
    axios.put(`/payment/${id}/status`, payload);

// Delete payment (Admin)
export const deletePayment = (id: number) => axios.delete(`/payment/${id}`);

// Search by transaction code (Admin/Staff)
export const searchPaymentsByTransactionCode = (transactionCode: string) =>
    axios.get(`/payment/search?transactionCode=${encodeURIComponent(transactionCode)}`);

// Get payments by date range (Admin/Staff)
export const getPaymentsByDateRange = (startDate: string, endDate: string) =>
    axios.get(`/payment/date-range?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`);

// Get total revenue (Admin)
export const getTotalRevenue = () => axios.get("/payment/revenue/total");

// Get payment statistics (Admin)
export const getPaymentStatistics = () => axios.get("/payment/statistics");

// Verify payment
export const verifyPayment = (id: number, payload: VerifyPaymentDto) =>
    axios.post(`/payment/${id}/verify`, payload);