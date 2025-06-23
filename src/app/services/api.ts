import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export interface User {
  UID: number;
  Fname: string;
  Lname: string;
  Mname: string;
  DOB: Date;
  StatusType: string;
  DepartmentID: number;
  UserType: string;
  Email: string;
  Phone: string;
  CID: number;
}

export interface Company {
  cid: number;
  companyName: string;
  location: string;
  strength: string;
}

export const userApi = {
  getAll: () => axios.get<User[]>(`${API_BASE_URL}/user`),
  getById: (id: number) => axios.get<User>(`${API_BASE_URL}/user/${id}`),
  create: (data: Omit<User, 'UID'>) => axios.post<User>(`${API_BASE_URL}/user`, data),
  update: (id: number, data: Partial<User>) => axios.patch<User>(`${API_BASE_URL}/user/${id}`, data),
  delete: (id: number) => axios.delete(`${API_BASE_URL}/user/${id}`),
};

export const companyApi = {
  getAll: () => axios.get<Company[]>(`${API_BASE_URL}/company`),
  getById: (id: number) => axios.get<Company>(`${API_BASE_URL}/company/${id}`),
  create: (data: Omit<Company, 'cid'>) => axios.post<Company>(`${API_BASE_URL}/company`, data),
  update: (id: number, data: Partial<Company>) => axios.patch<Company>(`${API_BASE_URL}/company/${id}`, data),
  delete: (id: number) => axios.delete(`${API_BASE_URL}/company/${id}`),
}; 