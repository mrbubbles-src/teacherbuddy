import { ISaveToLocalStorage } from '@/lib/types';

export const saveStudentsToLocalStorage = (state: ISaveToLocalStorage) => {
  localStorage.setItem('studentNames', JSON.stringify(state.studentNames));
};
export const saveQuizToLocalStorage = (state: ISaveToLocalStorage) => {
  localStorage.setItem('quizQuestions', JSON.stringify(state.quizQuestions));
};
