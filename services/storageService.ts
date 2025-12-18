import { UserProfile } from '../types';

const DB_KEY = 'shush_app_db';
const SESSION_KEY = 'shush_current_user_id';

interface Database {
  users: UserProfile[];
}

// Initialize DB if empty
const getDB = (): Database => {
  const db = localStorage.getItem(DB_KEY);
  if (!db) {
    const init: Database = { users: [] };
    localStorage.setItem(DB_KEY, JSON.stringify(init));
    return init;
  }
  return JSON.parse(db);
};

const saveDB = (db: Database) => {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
};

export const authService = {
  signup: (username: string): UserProfile | null => {
    const db = getDB();
    if (db.users.find(u => u.username === username)) {
      return null; // User exists
    }
    const newUser: UserProfile = {
      id: Date.now().toString(),
      username,
      cycleLength: 28,
      periodLength: 5,
      logs: []
    };
    db.users.push(newUser);
    saveDB(db);
    localStorage.setItem(SESSION_KEY, newUser.id);
    return newUser;
  },

  login: (username: string): UserProfile | null => {
    const db = getDB();
    const user = db.users.find(u => u.username === username);
    if (user) {
      localStorage.setItem(SESSION_KEY, user.id);
      return user;
    }
    return null;
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  getCurrentUser: (): UserProfile | null => {
    const id = localStorage.getItem(SESSION_KEY);
    if (!id) return null;
    const db = getDB();
    return db.users.find(u => u.id === id) || null;
  }
};

export const userDataService = {
  updateSettings: (userId: string, cycleLength: number, periodLength: number) => {
    const db = getDB();
    const userIndex = db.users.findIndex(u => u.id === userId);
    if (userIndex > -1) {
      db.users[userIndex].cycleLength = cycleLength;
      db.users[userIndex].periodLength = periodLength;
      saveDB(db);
    }
  },

  togglePeriodDate: (userId: string, dateStr: string): string[] => {
    const db = getDB();
    const userIndex = db.users.findIndex(u => u.id === userId);
    if (userIndex > -1) {
      const logs = db.users[userIndex].logs;
      if (logs.includes(dateStr)) {
        // Remove date
        db.users[userIndex].logs = logs.filter(d => d !== dateStr);
      } else {
        // Add date
        db.users[userIndex].logs.push(dateStr);
        db.users[userIndex].logs.sort(); // Keep sorted
      }
      saveDB(db);
      return db.users[userIndex].logs;
    }
    return [];
  }
};
