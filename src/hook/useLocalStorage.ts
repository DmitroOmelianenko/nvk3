import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T, userId: string) {
  const storageKey = `user_${userId}_${key}`;

  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(storageKey);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(storedValue));
    } catch (error) {
      console.error(error);
    }
  }, [storageKey, storedValue]);

  return [storedValue, setStoredValue] as const;
}