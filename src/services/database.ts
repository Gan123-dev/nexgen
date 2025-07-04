import { Course, Week, Lecture, Assignment, StudentProgress, Notification, Analytics } from '../types';

// Mock database service for development with enhanced functionality
const mockData = {
  courses: [
    {
      id: 'course-1',
      title: 'Advanced Calculus',
      description: 'Master advanced calculus concepts including limits, derivatives, and integrals',
      weeks: [],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z',
      createdBy: 'admin-1'
    },
    {
      id: 'course-2',
      title: 'Linear Algebra',
      description: 'Comprehensive study of linear algebra including matrices, vectors, and eigenvalues',
      weeks: [],
      createdAt: '2024-01-02T00:00:00Z',
      updatedAt: '2024-01-16T00:00:00Z',
      createdBy: 'admin-1'
    }
  ] as Course[],
  weeks: {
    'course-1': [
      {
        id: 'week-1-1',
        courseId: 'course-1',
        weekNumber: 1,
        title: 'Introduction to Limits',
        description: 'Understanding the concept of limits and their applications',
        lectures: [
          {
            id: 'lecture-1-1-1',
            weekId: 'week-1-1',
            title: 'What are Limits?',
            description: 'Introduction to the fundamental concept of limits in calculus',
            videoUrl: 'https://www.youtube.com/watch?v=riXcZT2ICjA',
            resources: [],
            activities: [],
            duration: 45,
            order: 1,
            isPublished: true
          },
          {
            id: 'lecture-1-1-2',
            weekId: 'week-1-1',
            title: 'Limit Laws',
            description: 'Understanding and applying limit laws to solve complex problems',
            videoUrl: 'https://www.youtube.com/watch?v=kfF40MiS7zA',
            resources: [],
            activities: [],
            duration: 50,
            order: 2,
            isPublished: true
          }
        ],
        assignments: [
          {
            id: 'assignment-1-1-1',
            weekId: 'week-1-1',
            title: 'Limits Practice Problems',
            description: 'Solve various limit problems to test your understanding',
            type: 'homework',
            questions: [],
            totalPoints: 100,
            dueDate: '2024-02-01T23:59:59Z',
            timeLimit: 120,
            attempts: 3,
            isPublished: true
          }
        ],
        startDate: '2024-01-15T00:00:00Z',
        endDate: '2024-01-21T23:59:59Z',
        isActive: true
      },
      {
        id: 'week-1-2',
        courseId: 'course-1',
        weekNumber: 2,
        title: 'Derivatives',
        description: 'Learning about derivatives and their applications',
        lectures: [
          {
            id: 'lecture-1-2-1',
            weekId: 'week-1-2',
            title: 'Introduction to Derivatives',
            description: 'Understanding the concept of derivatives and their geometric interpretation',
            videoUrl: 'https://www.youtube.com/watch?v=WUvTyaaNkzM',
            resources: [],
            activities: [],
            duration: 40,
            order: 1,
            isPublished: true
          }
        ],
        assignments: [
          {
            id: 'assignment-1-2-1',
            weekId: 'week-1-2',
            title: 'Derivative Calculations',
            description: 'Practice calculating derivatives using various rules',
            type: 'quiz',
            questions: [],
            totalPoints: 75,
            dueDate: '2024-02-08T23:59:59Z',
            timeLimit: 90,
            attempts: 2,
            isPublished: false
          }
        ],
        startDate: '2024-01-22T00:00:00Z',
        endDate: '2024-01-28T23:59:59Z',
        isActive: false
      }
    ],
    'course-2': [
      {
        id: 'week-2-1',
        courseId: 'course-2',
        weekNumber: 1,
        title: 'Vectors and Matrices',
        description: 'Introduction to vectors and matrix operations',
        lectures: [
          {
            id: 'lecture-2-1-1',
            weekId: 'week-2-1',
            title: 'Vector Basics',
            description: 'Understanding vectors in 2D and 3D space',
            videoUrl: 'https://www.youtube.com/watch?v=fNk_zzaMoSs',
            resources: [],
            activities: [],
            duration: 35,
            order: 1,
            isPublished: true
          }
        ],
        assignments: [
          {
            id: 'assignment-2-1-1',
            weekId: 'week-2-1',
            title: 'Vector Operations',
            description: 'Practice vector addition, subtraction, and scalar multiplication',
            type: 'homework',
            questions: [],
            totalPoints: 80,
            dueDate: '2024-02-05T23:59:59Z',
            timeLimit: 0,
            attempts: 1,
            isPublished: true
          }
        ],
        startDate: '2024-01-15T00:00:00Z',
        endDate: '2024-01-21T23:59:59Z',
        isActive: true
      }
    ]
  } as Record<string, Week[]>,
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
  mockData.weeks[id] = [];
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
    mockData.courses[courseIndex] = { 
      ...mockData.courses[courseIndex], 
      ...updates,
      updatedAt: new Date().toISOString()
    };
  }
};

export const deleteCourse = async (courseId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  mockData.courses = mockData.courses.filter(c => c.id !== courseId);
  delete mockData.weeks[courseId];
};

// Week Management
export const createWeek = async (courseId: string, week: Omit<Week, 'id' | 'courseId'>): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const id = Math.random().toString(36).substr(2, 9);
  const weekWithId = { ...week, id, courseId };
  
  if (!mockData.weeks[courseId]) {
    mockData.weeks[courseId] = [];
  }
  mockData.weeks[courseId].push(weekWithId);
  
  // Update course's updatedAt timestamp
  await updateCourse(courseId, { updatedAt: new Date().toISOString() });
  
  return id;
};

export const getWeeks = async (courseId: string): Promise<Week[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockData.weeks[courseId] || [];
};

export const updateWeek = async (courseId: string, weekId: string, updates: Partial<Week>): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const weeks = mockData.weeks[courseId] || [];
  const weekIndex = weeks.findIndex(w => w.id === weekId);
  if (weekIndex !== -1) {
    weeks[weekIndex] = { ...weeks[weekIndex], ...updates };
    await updateCourse(courseId, { updatedAt: new Date().toISOString() });
  }
};

export const deleteWeek = async (courseId: string, weekId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  if (mockData.weeks[courseId]) {
    mockData.weeks[courseId] = mockData.weeks[courseId].filter(w => w.id !== weekId);
    await updateCourse(courseId, { updatedAt: new Date().toISOString() });
  }
};

// Lecture Management
export const createLecture = async (courseId: string, weekId: string, lecture: Omit<Lecture, 'id' | 'weekId'>): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const id = Math.random().toString(36).substr(2, 9);
  const lectureWithId = { ...lecture, id, weekId };
  
  const weeks = mockData.weeks[courseId] || [];
  const weekIndex = weeks.findIndex(w => w.id === weekId);
  if (weekIndex !== -1) {
    if (!weeks[weekIndex].lectures) {
      weeks[weekIndex].lectures = [];
    }
    weeks[weekIndex].lectures!.push(lectureWithId);
    await updateCourse(courseId, { updatedAt: new Date().toISOString() });
  }
  
  return id;
};

export const updateLecture = async (courseId: string, weekId: string, lectureId: string, updates: Partial<Lecture>): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const weeks = mockData.weeks[courseId] || [];
  const weekIndex = weeks.findIndex(w => w.id === weekId);
  if (weekIndex !== -1 && weeks[weekIndex].lectures) {
    const lectureIndex = weeks[weekIndex].lectures!.findIndex(l => l.id === lectureId);
    if (lectureIndex !== -1) {
      weeks[weekIndex].lectures![lectureIndex] = { 
        ...weeks[weekIndex].lectures![lectureIndex], 
        ...updates 
      };
      await updateCourse(courseId, { updatedAt: new Date().toISOString() });
    }
  }
};

export const deleteLecture = async (courseId: string, weekId: string, lectureId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const weeks = mockData.weeks[courseId] || [];
  const weekIndex = weeks.findIndex(w => w.id === weekId);
  if (weekIndex !== -1 && weeks[weekIndex].lectures) {
    weeks[weekIndex].lectures = weeks[weekIndex].lectures!.filter(l => l.id !== lectureId);
    await updateCourse(courseId, { updatedAt: new Date().toISOString() });
  }
};

// Assignment Management
export const createAssignment = async (courseId: string, weekId: string, assignment: Omit<Assignment, 'id' | 'weekId'>): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const id = Math.random().toString(36).substr(2, 9);
  const assignmentWithId = { ...assignment, id, weekId };
  
  const weeks = mockData.weeks[courseId] || [];
  const weekIndex = weeks.findIndex(w => w.id === weekId);
  if (weekIndex !== -1) {
    if (!weeks[weekIndex].assignments) {
      weeks[weekIndex].assignments = [];
    }
    weeks[weekIndex].assignments!.push(assignmentWithId);
    await updateCourse(courseId, { updatedAt: new Date().toISOString() });
  }
  
  return id;
};

export const updateAssignment = async (courseId: string, weekId: string, assignmentId: string, updates: Partial<Assignment>): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const weeks = mockData.weeks[courseId] || [];
  const weekIndex = weeks.findIndex(w => w.id === weekId);
  if (weekIndex !== -1 && weeks[weekIndex].assignments) {
    const assignmentIndex = weeks[weekIndex].assignments!.findIndex(a => a.id === assignmentId);
    if (assignmentIndex !== -1) {
      weeks[weekIndex].assignments![assignmentIndex] = { 
        ...weeks[weekIndex].assignments![assignmentIndex], 
        ...updates 
      };
      await updateCourse(courseId, { updatedAt: new Date().toISOString() });
    }
  }
};

export const deleteAssignment = async (courseId: string, weekId: string, assignmentId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const weeks = mockData.weeks[courseId] || [];
  const weekIndex = weeks.findIndex(w => w.id === weekId);
  if (weekIndex !== -1 && weeks[weekIndex].assignments) {
    weeks[weekIndex].assignments = weeks[weekIndex].assignments!.filter(a => a.id !== assignmentId);
    await updateCourse(courseId, { updatedAt: new Date().toISOString() });
  }
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