/**
 * Retrieves the list of student names from the browser's local storage.
 *
 * @returns string[] - An array of student names. If no student names are found in local storage,
 * an empty array is returned.
 *
 * @remarks
 * This function expects the local storage key `studentNames` to contain a JSON string
 * representing an array of student names. If the key does not exist or the value is not
 * a valid JSON string, the function will safely return an empty array.
 *
 * @example
 * // Assuming localStorage contains: { "studentNames": '["Alice", "Bob", "Charlie"]' }
 * const students = getStudents();
 * console.log(students); // Output: ["Alice", "Bob", "Charlie"]
 */
export const getStudents = (): string[] => {
  const students = localStorage.getItem('studentNames');
  return students?.length ? JSON.parse(students) : [];
};
/**
 * Retrieves an array of quiz questions from the browser's local storage.
 *
 * @returns string[] - An array of quiz questions. If no questions are found or the stored data is invalid, an empty array is returned.
 */
export const getQuestions = (): string[] => {
  const questions = localStorage.getItem('quizQuestions');
  return questions?.length ? JSON.parse(questions) : [];
};
