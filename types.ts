export interface Article {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  fullPrompt: string;
}

export enum ViewState {
  HOME = 'HOME',
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP',
  ARTICLE = 'ARTICLE',
  TRACKER = 'TRACKER',
  LIBRARY = 'LIBRARY'
}

export interface NavItem {
  label: string;
  action: () => void;
  isDropdown?: boolean;
}

export interface UserProfile {
  id: string;
  username: string;
  cycleLength: number; // Default 28
  periodLength: number; // Default 5
  logs: string[]; // Array of dates "YYYY-MM-DD" that are logged as period days
}