import axios from 'axios';
import { message } from 'antd';
const token ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MTcxMjM1ZjAwYTVlMTBjNDllZGZjYyIsImlhdCI6MTczMDAxNTU1OSwiZXhwIjoxNzM3NzkxNTU5fQ.3hBWs3Trkp7OlWbRIyVrhFz7wBkwSksIrNJLEiumk3c'
// Hàm lấy token từ localStorage và trả về header xác thực
const getAuthHeader = () => ({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token,
});

// Hàm lấy danh sách báo cáo với phân trang, lọc và tìm kiếm
export const listReports = async (page = 1, limit = 10, status = '', entityType = '', description = '') => {
    try {
        const response = await axios.get('http://localhost:5173/api/v1/reports/v2', {
            headers: getAuthHeader(),
            params: { page, limit, status, entityType, description }
        });
        return response.data;
    } catch (error) {
        message.error('Error fetching reports: ' + error.message);
        throw error;
    }
};
export const getReportById = async (id) => {
    try {
        const response = await axios.get(`http://localhost:5173/api/v1/reports/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching report details:', error);
        throw error;
    }
};
export const getReportStats = async () => {
    try {
        const response = await axios.get('http://localhost:5173/api/v1/reports/stats');
        return response.data;
    } catch (error) {
        console.error('Error fetching report stats:', error);
        throw error;
    }
}
// // Hàm tạo báo cáo mới (nếu cần)
// export const createReport = async (reportData) => {
//     try {
//         const response = await axios.post('/api/v1/reports', reportData, {
//             headers: getAuthHeader()
//         });
//         return response.data;
//     } catch (error) {
//         message.error('Error creating report: ' + error.message);
//         throw error;
//     }
// };

// Hàm cập nhật trạng thái báo cáo (nếu cần)
export const updateReport = async (reportId, updatedData) => {
    try {
        const response = await axios.patch(`http://localhost:5173/api/v1/reports/${reportId}`, updatedData, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        message.error('Error updating report: ' + (error.response?.data?.message || error.message));
        throw error;
    }
};


// Hàm xóa báo cáo (nếu cần)
// export const deleteReport = async (reportId) => {
//     try {
//         const response = await axios.delete(`/api/v1/reports/${reportId}`, {
//             headers: getAuthHeader()
//         });
//         return response.data;
//     } catch (error) {
//         message.error('Error deleting report: ' + error.message);
//         throw error;
//     }
// };
// Hàm vô hiệu hóa bài viết dựa trên reportId
export const deactivatePost = async (reportId) => {
    try {
        const response = await axios.patch(`http://localhost:5173/api/v1/reports/${reportId}/deactivate-post`, {}, {
            headers: getAuthHeader()
        });
        message.success('Post deactivated successfully.');
        return response.data;
    } catch (error) {
        message.error('Error deactivating post: ' + error.message);
        throw error;
    }
};
