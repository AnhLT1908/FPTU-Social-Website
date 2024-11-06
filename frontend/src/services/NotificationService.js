import axios from 'axios';
import { message } from 'antd';
import { getHeader } from './api';
export const listNotifications = async () => {
  try {
    const response = await axios.get(
      'http://localhost:9999/api/v1/notifications',
      {
        // Updated endpoint
        headers: getHeader(),
      }
    );
    return response?.data;
  } catch (error) {
    message.error('Error fetching users: ' + error?.message);
    throw error;
  }
};
