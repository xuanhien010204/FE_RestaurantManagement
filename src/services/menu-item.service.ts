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

export const searchMenuItems = async (keyword?: string): Promise<MenuItem[]> => {
    const response = await menuItemApi.searchMenuItems(keyword);
    return response.data.map(mapBackendMenuItemToFrontend);
};

export const createMenuItem = async (payload: MenuItemCreateRequest): Promise<MenuItem> => {
    const response = await menuItemApi.createMenuItem(payload);
    return mapBackendMenuItemToFrontend(response.data);
};

export const getMenuItemById = async (id: number): Promise<MenuItem> => {
    const response = await menuItemApi.getMenuItemById(id);
    return mapBackendMenuItemToFrontend(response.data);
};

export const updateMenuItem = async (id: number, payload: MenuItemCreateRequest): Promise<void> => {
    await menuItemApi.updateMenuItem(id, payload);
};

export const deleteMenuItem = async (id: number): Promise<void> => {
    await menuItemApi.deleteMenuItem(id);
};

export const uploadMenuItemImage = async (menuItemId: number, file: File) => {
    const response = await menuItemApi.uploadMenuItemImage(menuItemId, file);
    return response.data;
};

export const getMenuItemImage = async (menuItemId: number, imageId: number) => {
    const response = await menuItemApi.getMenuItemImage(menuItemId, imageId);
    return response.data;
};

// Map backend menu item DTO to frontend MenuItem type
const mapBackendMenuItemToFrontend = (raw: unknown): MenuItem => {
    const backendMenuItem = raw as Record<string, unknown>;

    return {
        id: Number(backendMenuItem.id ?? 0),
        name: String(backendMenuItem.name ?? ""),
        description: backendMenuItem.description as string | undefined,
        price: Number(backendMenuItem.price ?? 0),
        category: backendMenuItem.category as string | undefined,
        status: MenuItemStatusMap[Number(backendMenuItem.status ?? 0)] ?? "Available",
        images: backendMenuItem.images as MenuItem["images"],
    };
};