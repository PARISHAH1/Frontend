import axios from 'axios';

const API_URL = 'http://localhost:5000/todos';

export interface ToDo {
  ToDoId?: number;
  BucketID?: number;
  AssignTo?: number;
  AssgnBy?: number;
  NotificationTo?: string;
  DueDateTime?: Date | string;
  Priority?: string;
  StatusType?: string;
  FilePath?: string;
  ReturnFileFlag?: boolean;
  ReturnFilePath?: string;
  Recording?: string;
  Title?: string;
  Description?: string;
  Repeted?: boolean;
  CID?: number;
  created?: Date;
  updated?: Date;
  CreatedBy?: number;
  UpdatedBy?: number;
}

function getAuthHeader() {
  const token = sessionStorage.getItem('accessToken');
  if (token) {
    const parsedToken = JSON.parse(token);
    return { Authorization: `Bearer ${parsedToken}` };
  }
  return {};
}

export const createToDo = async (todo: Partial<ToDo>): Promise<ToDo> => {
  const response = await axios.post<ToDo>(API_URL, todo, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const getAllToDos = async (): Promise<ToDo[]> => {
  const response = await axios.get<ToDo[]>(API_URL, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const getToDoById = async (id: number): Promise<ToDo> => {
  const response = await axios.get<ToDo>(`${API_URL}/${id}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const updateToDo = async (id: number, todo: Partial<ToDo>): Promise<ToDo> => {
  const response = await axios.put<ToDo>(`${API_URL}/${id}`, todo, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const deleteToDo = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`, {
    headers: getAuthHeader(),
  });
}; 