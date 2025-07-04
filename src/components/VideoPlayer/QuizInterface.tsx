import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Send,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import Button from '../UI/Button';
import Modal from '../UI/Modal';
import { Quiz, QuizAttempt, Question } from '../../types/quiz';

interface QuizInterfaceProps {
  quiz: Quiz;
  onSubmit: (answers: Record<string, any>) => void;
  onCancel: () => void;
  onStart: () => void;
  isLoading: boolean;
  currentAttempt: QuizAttempt | null;
}

const QuizInterface: React.FC<QuizInterfaceProps> = ({
  quiz,
  onSubmit,
  onCancel,
  onStart,
  isLoading,
  currentAttempt
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    if (quiz.timeLimit && quizStarted) {
      setTimeRemaining(quiz.timeLimit * 60); // Convert minutes to seconds
    }
  }, [quiz.timeLimit, quizStarted]);

  useEffect(() => {
    if (timeRemaining !== null && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0) {
      handleSubmit();
    }
  }, [timeRemaining]);

  const handleStart = () => {
    setQuizStarted(true);
    onStart();
  };

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = () => {
    onSubmit(answers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getAnsweredCount = (): number => {
    return Object.keys(answers).length;
  };

  const isCurrentQuestionAnswered = (): boolean => {
    const currentQuestion = quiz.questions[currentQuestionIndex];
    return answers[currentQuestion.id] !== undefined && answers[currentQuestion.id] !== '';
  };

  const canSubmit = (): boolean => {
    return getAnsweredCount() === quiz.questions.length;
  };

  if (!quizStarted) {
    return (
      <Modal isOpen={true} onClose={onCancel} title="Quiz Instructions" maxWidth="lg">
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-secondary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{quiz.title}</h3>
            {quiz.description && (
              <p className="text-dark-300">{quiz.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-dark-700 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-primary-400 mb-1">{quiz.questions.length}</div>
              <div className="text-sm text-dark-300">Questions</div>
            </div>
            <div className="bg-dark-700 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-secondary-400 mb-1">
                {quiz.timeLimit ? `${quiz.timeLimit}m` : '∞'}
              </div>
              <div className="text-sm text-dark-300">Time Limit</div>
            </div>
            <div className="bg-dark-700 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-accent-400 mb-1">{quiz.passingScore || 70}%</div>
              <div className="text-sm text-dark-300">Passing Score</div>
            </div>
          </div>

          {quiz.instructions && (
            <div className="bg-dark-700 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-2">Instructions:</h4>
              <p className="text-dark-300 text-sm">{quiz.instructions}</p>
            </div>
          )}

          <div className="bg-orange-600/10 border border-orange-600/20 p-4 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-orange-400 mr-2 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-orange-300">
                <p className="font-medium mb-1">Important Notes:</p>
                <ul className="space-y-1 text-orange-200">
                  <li>• You can navigate between questions before submitting</li>
                  <li>• Make sure to answer all questions before submitting</li>
                  {quiz.timeLimit && <li>• The quiz will auto-submit when time runs out</li>}
                  <li>• You cannot change answers after submission</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleStart}>
              Start Quiz
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <Modal isOpen={true} onClose={onCancel} title={quiz.title} maxWidth="2xl">
      <div className="space-y-6">
        {/* Quiz Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-dark-400">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </span>
            <div className="w-32 bg-dark-600 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
              />
            </div>
          </div>
          
          {timeRemaining !== null && (
            <div className={`flex items-center space-x-2 ${timeRemaining < 300 ? 'text-red-400' : 'text-dark-300'}`}>
              <Clock className="h-4 w-4" />
              <span className="font-mono">{formatTime(timeRemaining)}</span>
            </div>
          )}
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <div className="bg-dark-700 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-white mb-4">
                {currentQuestion.text}
              </h3>

              {currentQuestion.type === 'multiple-choice' && (
                <div className="space-y-3">
                  {currentQuestion.options?.map((option, index) => (
                    <label
                      key={index}
                      className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        answers[currentQuestion.id] === index
                          ? 'border-primary-600 bg-primary-600/10'
                          : 'border-dark-600 hover:border-dark-500'
                      }`}
                    >
                      <input
                        type="radio"
                        name={currentQuestion.id}
                        value={index}
                        checked={answers[currentQuestion.id] === index}
                        onChange={() => handleAnswerChange(currentQuestion.id, index)}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                        answers[currentQuestion.id] === index
                          ? 'border-primary-600 bg-primary-600'
                          : 'border-dark-400'
                      }`}>
                        {answers[currentQuestion.id] === index && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                      <span className="text-white">{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {currentQuestion.type === 'short-answer' && (
                <textarea
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  placeholder="Enter your answer..."
                  className="w-full p-3 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  rows={4}
                />
              )}

              {currentQuestion.type === 'essay' && (
                <textarea
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  placeholder="Write your essay response..."
                  className="w-full p-3 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  rows={8}
                />
              )}

              {currentQuestion.points && (
                <div className="mt-3 text-sm text-dark-400">
                  Points: {currentQuestion.points}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-3">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              icon={<ArrowLeft className="h-4 w-4" />}
            >
              Previous
            </Button>
            
            {currentQuestionIndex < quiz.questions.length - 1 ? (
              <Button
                onClick={handleNext}
                icon={<ArrowRight className="h-4 w-4" />}
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canSubmit() || isLoading}
                loading={isLoading}
                icon={<Send className="h-4 w-4" />}
              >
                Submit Quiz
              </Button>
            )}
          </div>

          <div className="text-sm text-dark-400">
            Answered: {getAnsweredCount()}/{quiz.questions.length}
          </div>
        </div>

        {/* Question Overview */}
        <div className="bg-dark-700 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-white mb-3">Question Overview</h4>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {quiz.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-8 h-8 rounded text-xs font-medium transition-all ${
                  index === currentQuestionIndex
                    ? 'bg-primary-600 text-white'
                    : answers[quiz.questions[index].id] !== undefined
                    ? 'bg-accent-600 text-white'
                    : 'bg-dark-600 text-dark-300 hover:bg-dark-500'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-center space-x-4 mt-3 text-xs text-dark-400">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-primary-600 rounded mr-1" />
              Current
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-accent-600 rounded mr-1" />
              Answered
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-dark-600 rounded mr-1" />
              Unanswered
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default QuizInterface;