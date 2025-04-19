import { ISaveToLocalStorage } from '@/lib/types';

/**
 * Saves the list of student names to the browser's local storage.
 *
 * @param state - An object containing the student names to be saved.
 * @param state.studentNames - An array of student names to store in local storage.
 */
export const saveStudentsToLocalStorage = (state: ISaveToLocalStorage) => {
  localStorage.setItem('studentNames', JSON.stringify(state.studentNames));
};
/**
 * Saves the quiz questions to the browser's local storage.
 *
 * @param state - An object implementing the `ISaveToLocalStorage` interface,
 * containing the `quizQuestions` to be saved.
 *
 * The data is stored under the key `'quizQuestions'` in local storage
 * as a JSON string.
 */
export const saveQuizToLocalStorage = (state: ISaveToLocalStorage) => {
  localStorage.setItem('quizQuestions', JSON.stringify(state.quizQuestions));
};
