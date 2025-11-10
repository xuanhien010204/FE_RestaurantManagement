import axios from "../axios";

export type MenuItemCreateDto = {
    name: string;
    description?: string;
    price: number;
    category: string;
};

export type MenuItemImageUploadResponse = {
    id: number;
    menuItemId: number;
    url: string;
};

// Get all menu items (public access)
export const getAllMenuItems = () => axios.get("/menu-item");

// Get menu item by ID (public access)
export const getMenuItemById = (id: number) => axios.get(`/menu-item/${id}`);

// Search menu items (staff/admin)
export const searchMenuItems = (keyword?: string) =>
    axios.get(`/menu-item/search?keyword=${encodeURIComponent(keyword || "")}`);

// Add menu item (staff/admin)
export const createMenuItem = (payload: MenuItemCreateDto) =>
    axios.post("/menu-item", payload);

// Update menu item (staff/admin)
export const updateMenuItem = (id: number, payload: MenuItemCreateDto) =>
    axios.put(`/menu-item/${id}`, payload);
export const getMenuItemImageByMenuItemId = (id: number) =>
    axios.get(`/menuitems/${id}/images`);

// Delete menu item (staff/admin)
export const deleteMenuItem = (id: number) =>
    axios.delete(`/menu-item/${id}`);

// Menu Item Image APIs
export const uploadMenuItemImage = (menuItemId: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post<MenuItemImageUploadResponse>(`/menuitems/${menuItemId}/images`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const getMenuItemImage = (menuItemId: number, imageId: number) =>
    axios.get(`/menuitems/${menuItemId}/images/${imageId}`);