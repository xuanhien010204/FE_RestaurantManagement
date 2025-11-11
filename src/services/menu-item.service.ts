import * as menuItemApi from "../utils/api/menu-item.api";
import type { MenuItem } from "../types/MenuItem";
import { extractData, extractArrayData, extractPaginatedData } from "../utils/response-mapper";

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
    const data = extractArrayData(response);
    const items = data.slice((page - 1) * limit, page * limit);
    return items.map(mapBackendMenuItemToFrontend);
};

// Lấy tất cả menu items (không dùng cho public list lớn)
export const getAllMenuItems = async (): Promise<MenuItem[]> => {
    const response = await menuItemApi.getAllMenuItems();
    const data = extractArrayData(response);
    return data.map(mapBackendMenuItemToFrontend);
};

// Lấy ảnh menu item theo menuItemId
export const getMenuItemImageByMenuItemId = async (menuItemId: number) => {
    const response = await menuItemApi.getMenuItemImageByMenuItemId(menuItemId);
    return extractData(response);
};

// Tạo món ăn
export const createMenuItem = async (payload: MenuItemCreateRequest): Promise<MenuItem> => {
    const response = await menuItemApi.createMenuItem(payload);
    return mapBackendMenuItemToFrontend(extractData(response));
};

// Lấy món ăn theo ID
export const getMenuItemById = async (id: number): Promise<MenuItem> => {
    const response = await menuItemApi.getMenuItemById(id);
    return mapBackendMenuItemToFrontend(extractData(response));
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
    return extractData(response);
};
// Tìm kiếm món ăn theo tên
export const searchMenuItems = async (query: string): Promise<MenuItem[]> => {
    const response = await menuItemApi.searchMenuItems(query);
    const data = extractArrayData(response);
    return data.map(mapBackendMenuItemToFrontend);
};

// Get paginated menu items
export const getPaginatedMenuItems = async (page: number = 1, pageSize: number = 10) => {
    const response = await menuItemApi.getPaginatedMenuItems(page, pageSize);
    const paginatedData = extractPaginatedData(response, page, pageSize);
    return {
        ...paginatedData,
        items: paginatedData.items.map(mapBackendMenuItemToFrontend),
    };
};

// Search paginated menu items
export const searchPaginatedMenuItems = async (keyword: string, page: number = 1, pageSize: number = 10) => {
    const response = await menuItemApi.searchPaginatedMenuItems(keyword, page, pageSize);
    const paginatedData = extractPaginatedData(response, page, pageSize);
    return {
        ...paginatedData,
        items: paginatedData.items.map(mapBackendMenuItemToFrontend),
    };
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
