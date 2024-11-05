import axios from 'axios';
import { message } from 'antd';
import { BASE_URL, getHeader } from './api';

export const getPostDetail = async (postId) => {
  try {
    const res = await axios.get(`${BASE_URL}/posts/${postId}`, {
      headers: getHeader(),
    });
    return res.data;
  } catch (error) {
    message.error('Error vote comment: ' + error?.message);
    throw error;
  }
};
export const doVotePost = async (postId, vote) => {
  try {
    const res = await axios.patch(
      `${BASE_URL}/posts/${postId}/vote`,
      { vote: vote },
      {
        headers: getHeader(),
      }
    );
    return res.data;
  } catch (error) {
    message.error('Error vote comment: ' + error?.message);
    throw error;
  }
};
