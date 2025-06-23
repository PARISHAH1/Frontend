import axios from 'axios';
import { User } from '@/types/user'; // Assuming you have a User type defined

const API_URL = 'http://localhost:5000/user';

function getAuthHeader() {
  const token = sessionStorage.getItem('accessToken');
  if (token) {
    const parsedToken = JSON.parse(token);
    return { Authorization: `Bearer ${parsedToken}` };
  }
  return {};
}

export const getAllUsers = async (): Promise<User[]> => {
  const response = await axios.get<User[]>(API_URL, {
    headers: getAuthHeader(),
  });
  return response.data;
}; 