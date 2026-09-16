import { User } from '../types';

const API_URL = 'https://69ad3080b50a169ec87ed7a6.mockapi.io/usersnvk';

export const registerUser = async (userData: Omit<User, 'id'>): Promise<User> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error('Помилка реєстрації');
  }

  return response.json();
};

export const loginUser = async (email: string, pass: string): Promise<User> => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Помилка завантаження даних користувачів');
  }

  const users: User[] = await response.json();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && String(u.password) === String(pass));

  if (!user) {
    throw new Error('Невірний email або пароль');
  }

  return user;
};