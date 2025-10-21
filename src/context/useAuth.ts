import { useContext } from "react";
import { AuthContext } from "./AuthContextBase";

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("dùng useAuth phải được sử dụng trong AuthProvider");
    return ctx;
}
