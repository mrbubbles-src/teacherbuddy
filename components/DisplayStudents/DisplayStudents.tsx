'use client';

import { useTeacherBuddy } from '@/context/TeacherBuddyContext';

const DisplayStudents = () => {
  const { state } = useTeacherBuddy();
  const students: Array<string> = state.studentNames;

  // Sort the student names alphabetically
  const sortedStudents = [...students].sort((a, b) => a.localeCompare(b));

  return (
    <>
      {sortedStudents &&
        sortedStudents.map((student, index) => <p key={index}>{student}</p>)}
    </>
  );
};

export default DisplayStudents;
