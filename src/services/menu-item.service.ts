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

// Get all menu items
export const getAllMenuItems = async (): Promise<MenuItem[]> => {
    const response = await menuItemApi.getAllMenuItems();
    console.log('[MenuItemService] getAllMenuItems response:', response);
    // Response can be array or wrapped in data property
    const data = Array.isArray(response.data) ? response.data : response.data?.data || [];
    return data.map(mapBackendMenuItemToFrontend);
};

// Search menu items by keyword
export const searchMenuItems = async (keyword?: string): Promise<MenuItem[]> => {
    const response = await menuItemApi.searchMenuItems(keyword);
    console.log('[MenuItemService] searchMenuItems response:', response);
    const data = Array.isArray(response.data) ? response.data : response.data?.data || [];
    return data.map(mapBackendMenuItemToFrontend);
};

// Create menu item
export const createMenuItem = async (payload: MenuItemCreateRequest): Promise<MenuItem> => {
    console.log('[MenuItemService] createMenuItem payload:', payload);
    const response = await menuItemApi.createMenuItem(payload);
    console.log('[MenuItemService] createMenuItem response:', response);
    // Backend returns 201 Created with the created item in response.data
    return mapBackendMenuItemToFrontend(response.data);
};

// Get menu item by ID
export const getMenuItemById = async (id: number): Promise<MenuItem> => {
    const response = await menuItemApi.getMenuItemById(id);
    return mapBackendMenuItemToFrontend(response.data);
};

// Update menu item
export const updateMenuItem = async (id: number, payload: MenuItemCreateRequest): Promise<void> => {
    console.log('[MenuItemService] updateMenuItem - id:', id, 'payload:', payload);
    await menuItemApi.updateMenuItem(id, payload);
    console.log('[MenuItemService] updateMenuItem success');
    // Backend returns 204 NoContent, no need to process response
};

// Delete menu item
export const deleteMenuItem = async (id: number): Promise<void> => {
    console.log('[MenuItemService] deleteMenuItem - id:', id);
    await menuItemApi.deleteMenuItem(id);
    console.log('[MenuItemService] deleteMenuItem success');
    // Backend returns 204 NoContent, no need to process response
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