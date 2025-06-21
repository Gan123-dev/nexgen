import { User } from '../types';

// Mock authentication service for development
let currentUser: User | null = null;

export const signIn = async (email: string, password: string): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock user data based on email
  const userData: User = {
    uid: Math.random().toString(36).substr(2, 9),
    email,
    displayName: email.includes('admin') ? 'Admin User' : 'Student User',
    role: email.includes('admin') ? 'admin' : 'student',
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  };
  
  currentUser = userData;
  localStorage.setItem('mathlearn_user', JSON.stringify(userData));
  return userData;
};

export const signUp = async (
  email: string, 
  password: string, 
  displayName: string, 
  role: 'admin' | 'student' = 'student'
): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const userData: User = {
    uid: Math.random().toString(36).substr(2, 9),
    email,
    displayName,
    role,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  };
  
  currentUser = userData;
  localStorage.setItem('mathlearn_user', JSON.stringify(userData));
  return userData;
};

export const signOut = async (): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  currentUser = null;
  localStorage.removeItem('mathlearn_user');
};

export const getCurrentUser = async (): Promise<User | null> => {
  // Check localStorage for existing user
  const storedUser = localStorage.getItem('mathlearn_user');
  if (storedUser) {
    try {
      currentUser = JSON.parse(storedUser);
      return currentUser;
    } catch (error) {
      localStorage.removeItem('mathlearn_user');
    }
  }
  
  return null;
};