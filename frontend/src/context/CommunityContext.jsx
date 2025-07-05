import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getHeader } from '../services/api';

const CommunityContext = createContext();

export const CommunityProvider = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [sidebarCommunity, setSidebarCommunity] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate('login');
      return;
    }
    const controller = new AbortController();
    const fetchCommunities = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9999/api/v1/communities/my-communities`,
          {
            signal: controller.signal,
            headers: getHeader(),
          }
        );
        console.log('Community:', response.data);
        setSidebarCommunity(response.data);
      } catch (error) {
        console.error('Error fetching communities:', error);
      }
    };

    fetchCommunities();

    return () => {
      controller.abort(); // Cleanup on unmount
    };
  }, []);

  return (
    <CommunityContext.Provider
      value={{ sidebarCommunity, setSidebarCommunity }}
    >
      {children}
    </CommunityContext.Provider>
  );
};

export const useCommunity = () => {
  return useContext(CommunityContext);
};