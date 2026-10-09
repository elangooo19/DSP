import { USERS } from './mockStore.js';

export const login = (username, password) => {
  const user = USERS.find(u => u.username === username && u.password === password);
  if (!user) throw new Error('Invalid username or password');
  localStorage.setItem('sadms_user', JSON.stringify({ id: user.id, username: user.username, role: user.role }));
  return { username: user.username, role: user.role, id: user.id };
};

export const logout = () => {
  localStorage.removeItem('sadms_user');
  window.location.replace('/');
};

export const getStoredUser = () => {
  try { return JSON.parse(localStorage.getItem('sadms_user')); } catch { return null; }
};

export const isLoggedIn = () => !!getStoredUser();
