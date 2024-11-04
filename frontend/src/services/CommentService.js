import axios from 'axios';
import { message } from 'antd';
import { BASE_URL, getHeader } from './api';
export const listComments = async (postId, startAfter) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/posts/${postId}/comments/?limit=2&startAfter=${
        startAfter ? startAfter : ''
      }`,
      {
        // Updated endpoint
        headers: getHeader(),
      }
    );
    return response.data;
  } catch (error) {
    message.error('Error fetching comments: ' + error?.message);
    throw error;
  }
};
export const postNewComment = async (data) => {
  try {
    const res = await axios.post(`${BASE_URL}/comments`, data, {
      headers: getHeader(),
    });
    return res.data;
  } catch (error) {
    message.error('Error create new comment: ' + error?.message);
    throw error;
  }
};
export const doVoteComment = async (commentId, vote) => {
  try {
    const res = await axios.patch(
      `${BASE_URL}/comments/${commentId}/vote`,
      { vote: vote },
      {
        headers: getHeader(),
      }
    );
    console.log(res.data);
    
    return res.data;
  } catch (error) {
    message.error('Error vote comment: ' + error?.message);
    throw error;
  }
};
