import { SavedAppState } from '../types';

export type User = {
  firstName: string;
  lastName: string;
  email: string;
};

export type SignUpUser = User & { password: string };

export type SignInUser = Omit<User, 'firstName' | 'lastName'> & { password: string };

export type TokenResponse = { access_token: string; refresh_token: string };

export type Project = {
  id?: string;
  title: string;
  description: string;
  data: SavedAppState;
  published: boolean;
  userId?: string;
  created_at?: string;
  updated_at?: string;
};

export type ProjectListItem = {
  id: string;
  title: string;
  description: string;
  user: User;
  created_at: string;
  updated_at: string;
};
