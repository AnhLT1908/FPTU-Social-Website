import axios from 'axios';
import { message } from 'antd';

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MjA2NjcyZWM4NDk5NTZjODU2N2RlMyIsImlhdCI6MTczMDE3Njk2MiwiZXhwIjoxNzM3OTUyOTYyfQ.tJvV6vlj-tdOzWvoemJ8S8SUzuUU8ojRxNS-CSnRu4o';

// Function to get the authorization header
const getAuthHeader = () => ({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token,
});

// Function to get the list of users with pagination, filtering, and searching
export const getListUser = async (page = 1, limit = 5, status = '', email = '', username = '') => {
    try {
        const response = await axios.get('http://localhost:9999/api/v1/users/list', { // Updated endpoint
            headers: getAuthHeader(),
            params: { page, limit, status, email, username } // Updated parameters for users
        });
        return response.data;
    } catch (error) {
        message.error('Error fetching users: ' + error.message);
        throw error;
    }
};
// Function to toggle user status by ID
export const toggleUserStatus = async (userId) => {
    try {
        const response = await axios.patch(`http://localhost:9999/api/v1/users/${userId}/toggle-active`, {}, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        message.error('Error updating user status: ' + error.message);
        throw error;
    }
};