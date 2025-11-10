import * as menuItemApi from "../utils/api/menu-item.api";
import type { MenuItem } from "../types/MenuItem";

export interface MenuItemCreateRequest {
    name: string;
    description?: string;
    price: number;
    category: string;
}

const MenuItemStatusMap: Record<number, MenuItem["status"]> = {
    0: "Available",
    1: "OutOfStock"
};

// Lấy menu items theo page và limit (8 món / lần)
export const getMenuItemsByPage = async (page: number, limit: number): Promise<MenuItem[]> => {
    const response = await menuItemApi.getAllMenuItems();
    const data = Array.isArray(response.data) ? response.data : response.data?.data || [];
    const items = data.slice((page - 1) * limit, page * limit);
    return items.map(mapBackendMenuItemToFrontend);
};

// Lấy tất cả menu items (không dùng cho public list lớn)
export const getAllMenuItems = async (): Promise<MenuItem[]> => {
    const response = await menuItemApi.getAllMenuItems();
    const data = Array.isArray(response.data) ? response.data : response.data?.data || [];
    return data.map(mapBackendMenuItemToFrontend);
};

// Lấy ảnh menu item theo menuItemId
export const getMenuItemImageByMenuItemId = async (menuItemId: number) => {
    const response = await menuItemApi.getMenuItemImageByMenuItemId(menuItemId);
    return response.data;
};

// Tạo món ăn
export const createMenuItem = async (payload: MenuItemCreateRequest): Promise<MenuItem> => {
    const response = await menuItemApi.createMenuItem(payload);
    return mapBackendMenuItemToFrontend(response.data);
};

// Lấy món ăn theo ID
export const getMenuItemById = async (id: number): Promise<MenuItem> => {
    const response = await menuItemApi.getMenuItemById(id);
    return mapBackendMenuItemToFrontend(response.data);
};

// Cập nhật món ăn
export const updateMenuItem = async (id: number, payload: MenuItemCreateRequest): Promise<void> => {
    await menuItemApi.updateMenuItem(id, payload);
};

// Xóa món ăn
export const deleteMenuItem = async (id: number): Promise<void> => {
    await menuItemApi.deleteMenuItem(id);
};

// Upload ảnh món ăn
export const uploadMenuItemImage = async (menuItemId: number, file: File) => {
    const response = await menuItemApi.uploadMenuItemImage(menuItemId, file);
    return response.data;
};

// Map backend menu item DTO → frontend MenuItem
const mapBackendMenuItemToFrontend = (raw: unknown): MenuItem => {
    const backendMenuItem = raw as Record<string, unknown>;
    return {
        id: Number(backendMenuItem.id ?? 0),
        name: String(backendMenuItem.name ?? ""),
        description: backendMenuItem.description as string | undefined,
        price: Number(backendMenuItem.price ?? 0),
        category: backendMenuItem.category as string | undefined,
        status: MenuItemStatusMap[Number(backendMenuItem.status ?? 0)] ?? "Available",
        images: backendMenuItem.images as MenuItem["images"] ?? [],
    };
};
