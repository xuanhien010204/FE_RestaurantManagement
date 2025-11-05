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

export const searchMenuItems = (keyword?: string) => axios.get(`/menu-item/search?keyword=${encodeURIComponent(keyword || "")}`);
export const createMenuItem = (payload: MenuItemCreateDto) => axios.post("/menu-item", payload);
export const getMenuItemById = (id: number) => axios.get(`/menu-item/${id}`);
export const updateMenuItem = (id: number, payload: MenuItemCreateDto) => axios.put(`/menu-item/${id}`, payload);
export const deleteMenuItem = (id: number) => axios.delete(`/menu-item/${id}`);

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

export const getMenuItemImage = (menuItemId: number, imageId: number) => axios.get(`/menuitems/${menuItemId}/images/${imageId}`);