import { create } from 'zustand';
import { Lesson, Course, Category } from '@/types/learning';

interface LearningStore {
    currentCategory: Category | null;
    currentCourse: Course | null;
    currentLesson: Lesson | null;
    isLoading: boolean;
    error: string | null;
    answerState: {
        isCorrect: boolean | null;
        showAnswer: boolean;
        lastAttempt: string | null;
    };

    setCategory: (category: Category | null) => void;
    setCourse: (course: Course | null) => void;
    setLesson: (lesson: Lesson | null) => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
    setAnswerState: (states: Partial<LearningStore['answerState']>) => void;
    resetAnswerState: () => void;
    revealAnswer: () => void;
}

export const useLearningStore = create<LearningStore>((set) => ({
    currentCategory: null,
    currentCourse: null,
    currentLesson: null,
    isLoading: false,
    error: null,
    answerState: {
        isCorrect: null,
        showAnswer: false,
        lastAttempt: null,
    },

    setCategory: (currentCategory) => set({ currentCategory }),
    setCourse: (currentCourse) => set({ currentCourse }),
    setLesson: (currentLesson) => set({ currentLesson }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
    setAnswerState: (updates) => set((state) => ({
        answerState: { ...state.answerState, ...updates }
    })),
    resetAnswerState: () => set({
        answerState: { isCorrect: null, showAnswer: false, lastAttempt: null }
    }),
    revealAnswer: () => set((state) => ({
        answerState: { ...state.answerState, showAnswer: true }
    })),
}));
