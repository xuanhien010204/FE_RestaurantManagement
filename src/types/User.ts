import type { StaffProfile } from "./StaffProfile";
import type { Reservation } from "./Reservation";
import type { Order } from "./Order";
import type { Feedback } from "./Feedback";

export type UserRole = "Admin" | "Staff" | "Customer";

export type UserStatus = "Active" | "Inactive" | "Suspended";

export interface User {
    id: number;
    fullName: string;
    email: string;
    passwordHash: string;
    phone?: string;
    address?: string;
    role: UserRole;
    status: UserStatus;
    createdAt: string;   // DateTime => string ISO  
    updatedAt?: string;
    isDeleted: boolean;
    staffProfile?: StaffProfile;
    reservations?: Reservation[];
    orders?: Order[];
    feedbacks?: Feedback[];
}
