
type StorageKey = string;


export const setSessionItem = <T>(key: StorageKey, value: T): void => {
  try {
    const serializedValue = JSON.stringify(value);
    sessionStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error('Error setting session storage item:', error);
  }
};


export const getSessionItem = <T>(key: StorageKey): T | null => {
  try {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error getting session storage item:', error);
    return null;
  }
};


export const removeSessionItem = (key: StorageKey): void => {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing session storage item:', error);
  }
};


export const clearSessionStorage = (): void => {
  try {
    sessionStorage.clear();
  } catch (error) {
    console.error('Error clearing session storage:', error);
  }
};


export const hasSessionItem = (key: StorageKey): boolean => {
  try {
    return sessionStorage.getItem(key) !== null;
  } catch (error) {
    console.error('Error checking session storage item:', error);
    return false;
  }
}; 