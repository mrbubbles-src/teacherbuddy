import { ISaveToLocalStorage } from '@/lib/types';

export const saveToLocalStorage = (state: ISaveToLocalStorage) => {
  localStorage.setItem('studentNames', JSON.stringify(state.studentNames));
  localStorage.setItem('quizQuestions', JSON.stringify(state.quizQuestions));
};
