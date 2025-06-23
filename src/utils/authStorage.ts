import { getSessionItem, setSessionItem, removeSessionItem } from './sessionStorage';


const ACCESS_TOKEN_KEY = 'access_token';


export const saveAccessToken = (token: string): void => {
  setSessionItem(ACCESS_TOKEN_KEY, token);
};


export const getAccessToken = (): string | null => {
  return getSessionItem<string>(ACCESS_TOKEN_KEY);
};

export const removeAccessToken = (): void => {
  removeSessionItem(ACCESS_TOKEN_KEY);
};


   

export const hasAccessToken = (): boolean => {
  return getAccessToken() !== null;
}; 