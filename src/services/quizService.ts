import { Quiz, QuizAttempt, VideoProgress, QuizResult, QuestionFeedback } from '../types/quiz';

// Mock storage for development with sample quiz data
const mockStorage = {
  quizzes: new Map<string, Quiz>([
    // Sample quiz for the first lecture
    ['lecture-1-1-1', {
      id: 'quiz-1-1-1',
      title: 'Limits Fundamentals Quiz',
      description: 'Test your understanding of basic limit concepts',
      instructions: 'Answer all questions to the best of your ability. You have 3 attempts to pass.',
      questions: [
        {
          id: 'q1',
          text: 'What is the limit of f(x) = x² as x approaches 2?',
          type: 'multiple-choice',
          options: ['2', '4', '8', 'undefined'],
          correctAnswer: 1,
          points: 10,
          explanation: 'When x approaches 2, x² approaches 2² = 4'
        },
        {
          id: 'q2',
          text: 'Which of the following statements about limits is true?',
          type: 'multiple-choice',
          options: [
            'The limit always equals the function value',
            'Limits can exist even when the function is undefined at that point',
            'Limits are always finite',
            'Limits only exist for continuous functions'
          ],
          correctAnswer: 1,
          points: 15,
          explanation: 'Limits can exist even when the function is undefined at that point, which is a key concept in calculus.'
        },
        {
          id: 'q3',
          text: 'Explain in your own words what a limit represents in calculus.',
          type: 'short-answer',
          correctAnswer: 'approaching value',
          points: 25,
          explanation: 'A limit represents the value that a function approaches as the input approaches a certain value.'
        }
      ],
      timeLimit: 15,
      passingScore: 70,
      maxAttempts: 3,
      shuffleQuestions: false,
      showFeedback: true
    }],
    // Sample quiz for the second lecture
    ['lecture-1-1-2', {
      id: 'quiz-1-1-2',
      title: 'Limit Laws Quiz',
      description: 'Apply limit laws to solve problems',
      instructions: 'Use the limit laws you learned to solve these problems.',
      questions: [
        {
          id: 'q1',
          text: 'If lim(x→2) f(x) = 5 and lim(x→2) g(x) = 3, what is lim(x→2) [f(x) + g(x)]?',
          type: 'multiple-choice',
          options: ['5', '3', '8', '15'],
          correctAnswer: 2,
          points: 20,
          explanation: 'By the sum rule for limits: lim[f(x) + g(x)] = lim f(x) + lim g(x) = 5 + 3 = 8'
        },
        {
          id: 'q2',
          text: 'What is lim(x→0) (sin x)/x?',
          type: 'multiple-choice',
          options: ['0', '1', '∞', 'undefined'],
          correctAnswer: 1,
          points: 25,
          explanation: 'This is a famous limit that equals 1, often used in trigonometric limit problems.'
        }
      ],
      timeLimit: 10,
      passingScore: 75,
      maxAttempts: 3,
      shuffleQuestions: false,
      showFeedback: true
    }],
    // Sample quiz for derivatives lecture
    ['lecture-1-2-1', {
      id: 'quiz-1-2-1',
      title: 'Introduction to Derivatives Quiz',
      description: 'Test your understanding of derivative concepts',
      instructions: 'Answer questions about derivatives and their geometric interpretation.',
      questions: [
        {
          id: 'q1',
          text: 'What does the derivative of a function represent geometrically?',
          type: 'multiple-choice',
          options: [
            'The area under the curve',
            'The slope of the tangent line',
            'The y-intercept',
            'The maximum value'
          ],
          correctAnswer: 1,
          points: 15,
          explanation: 'The derivative represents the slope of the tangent line to the curve at any given point.'
        },
        {
          id: 'q2',
          text: 'What is the derivative of f(x) = x³?',
          type: 'short-answer',
          correctAnswer: '3x²',
          points: 20,
          explanation: 'Using the power rule: d/dx(xⁿ) = nxⁿ⁻¹, so d/dx(x³) = 3x²'
        },
        {
          id: 'q3',
          text: 'If f(x) = 5x² + 3x - 2, what is f\'(x)?',
          type: 'multiple-choice',
          options: ['10x + 3', '5x + 3', '10x² + 3x', '5x² + 3'],
          correctAnswer: 0,
          points: 25,
          explanation: 'Using the power rule and sum rule: f\'(x) = 10x + 3'
        }
      ],
      timeLimit: 12,
      passingScore: 70,
      maxAttempts: 3,
      shuffleQuestions: false,
      showFeedback: true
    }]
  ]),
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