import { Course, Week, Lecture, Assignment, StudentProgress, Notification, Analytics } from '../types';

// Mock database service for development
const mockData = {
  courses: [] as Course[],
  progress: {} as Record<string, Record<string, StudentProgress>>,
  notifications: {} as Record<string, Notification[]>,
  analytics: {
    totalStudents: 156,
    activeStudents: 89,
    courseCompletionRate: 73,
    averageProgress: 68,
    weeklyEngagement: [
      { week: 'Week 1', engagement: 85 },
      { week: 'Week 2', engagement: 78 },
      { week: 'Week 3', engagement: 92 },
      { week: 'Week 4', engagement: 67 },
    ],
    topPerformers: [
      { userId: 'user1', score: 95 },
      { userId: 'user2', score: 92 },
      { userId: 'user3', score: 89 },
    ],
    contentPerformance: [
      { contentId: 'calc1', engagement: 88 },
      { contentId: 'algebra1', engagement: 76 },
      { contentId: 'stats1', engagement: 82 },
    ],
  } as Analytics
};

// Course Management
export const createCourse = async (course: Omit<Course, 'id'>): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const id = Math.random().toString(36).substr(2, 9);
  const courseWithId = { ...course, id };
  mockData.courses.push(courseWithId);
  return id;
};

export const getCourses = async (): Promise<Course[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockData.courses;
};

export const updateCourse = async (courseId: string, updates: Partial<Course>): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const courseIndex = mockData.courses.findIndex(c => c.id === courseId);
  if (courseIndex !== -1) {
    mockData.courses[courseIndex] = { ...mockData.courses[courseIndex], ...updates };
  }
};

export const deleteCourse = async (courseId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  mockData.courses = mockData.courses.filter(c => c.id !== courseId);
};

// Week Management
export const createWeek = async (courseId: string, week: Omit<Week, 'id' | 'courseId'>): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const id = Math.random().toString(36).substr(2, 9);
  return id;
};

export const getWeeks = async (courseId: string): Promise<Week[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [];
};

// Lecture Management
export const createLecture = async (courseId: string, weekId: string, lecture: Omit<Lecture, 'id' | 'weekId'>): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const id = Math.random().toString(36).substr(2, 9);
  return id;
};

// Student Progress
export const updateStudentProgress = async (userId: string, courseId: string, progress: Partial<StudentProgress>): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  if (!mockData.progress[userId]) {
    mockData.progress[userId] = {};
  }
  mockData.progress[userId][courseId] = { 
    ...mockData.progress[userId][courseId], 
    ...progress,
    userId,
    courseId
  } as StudentProgress;
};

export const getStudentProgress = async (userId: string, courseId: string): Promise<StudentProgress | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockData.progress[userId]?.[courseId] || null;
};

// Notifications
export const createNotification = async (notification: Omit<Notification, 'id'>): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const id = Math.random().toString(36).substr(2, 9);
  const notificationWithId = { ...notification, id };
  
  if (!mockData.notifications[notification.userId]) {
    mockData.notifications[notification.userId] = [];
  }
  mockData.notifications[notification.userId].push(notificationWithId);
  return id;
};

export const getUserNotifications = async (userId: string): Promise<Notification[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockData.notifications[userId] || [];
};

// Real-time listeners (mock implementation)
export const subscribeToProgressUpdates = (userId: string, courseId: string, callback: (progress: StudentProgress | null) => void) => {
  // Simulate real-time updates
  const interval = setInterval(() => {
    const progress = mockData.progress[userId]?.[courseId] || null;
    callback(progress);
  }, 5000);
  
  return () => clearInterval(interval);
};

export const subscribeToNotifications = (userId: string, callback: (notifications: Notification[]) => void) => {
  // Simulate real-time updates
  const interval = setInterval(() => {
    const notifications = mockData.notifications[userId] || [];
    callback(notifications);
  }, 10000);
  
  return () => clearInterval(interval);
};

// Analytics
export const getAnalytics = async (): Promise<Analytics> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockData.analytics;
};