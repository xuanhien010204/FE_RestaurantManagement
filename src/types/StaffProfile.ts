import type { User } from "./User";

export interface StaffProfile {
    id: number;
    userId: number;
    position: string;  // Waiter, Chef, Manager
    hireDate: string;
    user?: User;
}
