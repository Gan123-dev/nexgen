import { Quiz, QuizAttempt, VideoProgress, QuizResult, QuestionFeedback } from '../types/quiz';

// Mock storage for development
const mockStorage = {
  quizzes: new Map<string, Quiz>(),
  attempts: new Map<string, QuizAttempt[]>(),
  videoProgress: new Map<string, VideoProgress[]>()
};

// Quiz Management
export const saveQuiz = async (lectureId: string, quiz: Quiz): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  mockStorage.quizzes.set(lectureId, quiz);
};

export const getQuiz = async (lectureId: string): Promise<Quiz | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockStorage.quizzes.get(lectureId) || null;
};

export const deleteQuiz = async (lectureId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  mockStorage.quizzes.delete(lectureId);
};

// Quiz Attempts
export const saveQuizAttempt = async (attempt: QuizAttempt): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const key = `${attempt.userId}-${attempt.lectureId}`;
  const existing = mockStorage.attempts.get(key) || [];
  existing.push(attempt);
  mockStorage.attempts.set(key, existing);
};

export const getQuizAttempts = async (userId: string, lectureId: string): Promise<QuizAttempt[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const key = `${userId}-${lectureId}`;
  return mockStorage.attempts.get(key) || [];
};

export const getBestQuizAttempt = async (userId: string, lectureId: string): Promise<QuizAttempt | null> => {
  const attempts = await getQuizAttempts(userId, lectureId);
  if (attempts.length === 0) return null;
  
  return attempts.reduce((best, current) => 
    current.score > best.score ? current : best
  );
};

// Video Progress
export const saveVideoProgress = async (progress: VideoProgress): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const key = `${progress.userId}-${progress.lectureId}`;
  const existing = mockStorage.videoProgress.get(key) || [];
  
  // Update existing or add new
  const existingIndex = existing.findIndex(p => p.lectureId === progress.lectureId);
  if (existingIndex >= 0) {
    existing[existingIndex] = progress;
  } else {
    existing.push(progress);
  }
  
  mockStorage.videoProgress.set(key, existing);
};

export const getVideoProgress = async (userId: string, lectureId: string): Promise<VideoProgress | null> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const key = `${userId}-${lectureId}`;
  const progressList = mockStorage.videoProgress.get(key) || [];
  return progressList.find(p => p.lectureId === lectureId) || null;
};

export const getAllVideoProgress = async (userId: string): Promise<VideoProgress[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const allProgress: VideoProgress[] = [];
  for (const [key, progressList] of mockStorage.videoProgress.entries()) {
    if (key.startsWith(userId)) {
      allProgress.push(...progressList);
    }
  }
  
  return allProgress;
};

// Quiz Results and Feedback
export const calculateQuizResult = async (attempt: QuizAttempt, quiz: Quiz): Promise<QuizResult> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const feedback: QuestionFeedback[] = quiz.questions.map(question => {
    const userAnswer = attempt.answers[question.id];
    let isCorrect = false;
    
    if (question.type === 'multiple-choice') {
      isCorrect = userAnswer === question.correctAnswer;
    } else if (question.type === 'short-answer') {
      const correct = question.correctAnswer?.toString().toLowerCase().trim();
      const user = userAnswer?.toString().toLowerCase().trim();
      isCorrect = correct === user;
    } else if (question.type === 'essay') {
      // Essay questions require manual grading
      isCorrect = false;
    }
    
    return {
      questionId: question.id,
      isCorrect,
      userAnswer,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      points: question.points,
      earnedPoints: isCorrect ? question.points : 0
    };
  });
  
  return {
    attempt,
    quiz,
    feedback
  };
};

// Analytics
export const getQuizAnalytics = async (lectureId: string): Promise<{
  totalAttempts: number;
  averageScore: number;
  passRate: number;
  completionRate: number;
}> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const allAttempts: QuizAttempt[] = [];
  for (const attempts of mockStorage.attempts.values()) {
    allAttempts.push(...attempts.filter(a => a.lectureId === lectureId));
  }
  
  if (allAttempts.length === 0) {
    return {
      totalAttempts: 0,
      averageScore: 0,
      passRate: 0,
      completionRate: 0
    };
  }
  
  const completedAttempts = allAttempts.filter(a => a.completedAt);
  const passedAttempts = completedAttempts.filter(a => a.passed);
  const averageScore = completedAttempts.reduce((sum, a) => sum + a.score, 0) / completedAttempts.length;
  
  return {
    totalAttempts: allAttempts.length,
    averageScore: Math.round(averageScore),
    passRate: Math.round((passedAttempts.length / completedAttempts.length) * 100),
    completionRate: Math.round((completedAttempts.length / allAttempts.length) * 100)
  };
};

// Validation
export const validateYouTubeUrl = (url: string): boolean => {
  const patterns = [
    /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)[\w-]+/,
    /^https?:\/\/(www\.)?youtube\.com\/watch\?.*v=[\w-]+/
  ];
  
  return patterns.some(pattern => pattern.test(url));
};

export const extractVideoId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  return null;
};

// Real-time subscriptions (mock implementation)
export const subscribeToQuizAttempts = (
  userId: string, 
  lectureId: string, 
  callback: (attempts: QuizAttempt[]) => void
) => {
  const interval = setInterval(async () => {
    const attempts = await getQuizAttempts(userId, lectureId);
    callback(attempts);
  }, 5000);
  
  return () => clearInterval(interval);
};

export const subscribeToVideoProgress = (
  userId: string, 
  lectureId: string, 
  callback: (progress: VideoProgress | null) => void
) => {
  const interval = setInterval(async () => {
    const progress = await getVideoProgress(userId, lectureId);
    callback(progress);
  }, 2000);
  
  return () => clearInterval(interval);
};