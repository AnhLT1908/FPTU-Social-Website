import { api } from "./api";

export async function searchCommunities(query) {
    try {
        const endpoint = `http://localhost:9999/api/v1/communities/search`;
        const response = await api.get(endpoint, { query });
        return response.data;
    } catch (error) {
        console.error("Error searching communities:", error);
        throw error;
    }
}

// Hàm tìm kiếm users
export async function searchUsers(query) {
    try {
        const endpoint = `http://localhost:9999/api/v1/users/search`;
        const response = await api.get(endpoint, { query });
        return response.data;
    } catch (error) {
        console.error("Error searching users:", error);
        throw error;
    }
}