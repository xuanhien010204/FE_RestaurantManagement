// Utility functions to handle backend API response structure
// Backend returns: { success: boolean, message: string, data: T }

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

/**
 * Extract data from API response
 * Handles both direct data and wrapped { success, message, data } format
 */
export function extractData<T>(response: { data: ApiResponse<T> | T }): T {
    const responseData = response.data;

    // Check if response has standard API wrapper
    if (responseData && typeof responseData === 'object' && 'data' in responseData) {
        return (responseData as ApiResponse<T>).data;
    }

    // Return data directly
    return responseData as T;
}

/**
 * Extract array data from API response
 * Returns empty array if data is not an array
 */
export function extractArrayData<T>(response: { data: ApiResponse<T[]> | T[] }): T[] {
    const data = extractData(response);
    return Array.isArray(data) ? data : [];
}

/**
 * Extract paginated data from API response
 */
export interface PaginatedResponse<T> {
    items: T[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
}

export function extractPaginatedData<T>(
    response: { data: ApiResponse<T[]> | T[] | PaginatedResponse<T> },
    defaultPage: number = 1,
    defaultPageSize: number = 10
): PaginatedResponse<T> {
    const data = extractData(response);

    // Check if already paginated format
    if (data && typeof data === 'object' && 'items' in data) {
        const paginated = data as PaginatedResponse<T>;
        return {
            items: paginated.items || [],
            totalItems: paginated.totalItems || 0,
            totalPages: paginated.totalPages || 0,
            currentPage: paginated.currentPage || defaultPage,
            pageSize: paginated.pageSize || defaultPageSize
        };
    }

    // Convert array to paginated format
    const items = Array.isArray(data) ? data : [];
    return {
        items,
        totalItems: items.length,
        totalPages: Math.ceil(items.length / defaultPageSize),
        currentPage: defaultPage,
        pageSize: defaultPageSize
    };
}
