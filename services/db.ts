
import { User, UserPreferences } from '../types';

const STORAGE_KEYS = {
  USERS: 'stylesense_users',
  CURRENT_USER: 'stylesense_current_user',
  HISTORY: 'stylesense_history'
};

export const db = {
  getUsers: (): any[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]'),
  
  saveUser: (user: any) => {
    const users = db.getUsers();
    users.push(user);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  setCurrentUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  getCurrentUser: (): User | null => {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  },

  updatePreferences: (userId: string, prefs: UserPreferences) => {
    const users = db.getUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx !== -1) {
      users[idx].preferences = prefs;
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      db.setCurrentUser(users[idx]);
    }
  },

  saveToHistory: (userId: string, item: any) => {
    const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || '{}');
    if (!history[userId]) history[userId] = [];
    history[userId].unshift({ ...item, timestamp: new Date().toISOString() });
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  },

  getHistory: (userId: string): any[] => {
    const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || '{}');
    return history[userId] || [];
  }
};
