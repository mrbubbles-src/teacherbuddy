export const getStudents = (): string[] => {
  const students = localStorage.getItem('studentNames');
  return students?.length ? JSON.parse(students) : [];
};
export const getQuestions = (): string[] => {
  const questions = localStorage.getItem('quizQuestions');
  return questions?.length ? JSON.parse(questions) : [];
};
