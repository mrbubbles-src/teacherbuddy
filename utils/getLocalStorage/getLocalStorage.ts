export const getStudents = (): string[] => {
  const students = localStorage.getItem('studentNames');
  return students?.length ? JSON.parse(students) : [];
};
