'use client';

import { useTeacherBuddy } from '@/context/TeacherBuddyContext';
import RemoveSingleStudent from '../RemoveSingle/RemoveSingleStudent';
import ClearAllStudents from '../ClearAll/ClearAllStudents';

const DisplayStudents = () => {
  const { state } = useTeacherBuddy();

  if (!state) {
    return null; // or handle the undefined state case appropriately
  }

  const students: Array<string> = state.studentNames;

  // Sort the student names alphabetically
  const sortedStudents = [...students].sort((a, b) => a.localeCompare(b));

  return (
    <>
      <ClearAllStudents />
      <section
      // className="border-3 flex h-[100vh] gap-3"
      >
        {sortedStudents &&
          sortedStudents.map((student, index) => (
            <p
              // className="rounded-2xl border border-brand-primary p-2"
              key={index}>
              {student}
              {<RemoveSingleStudent student={student} />}
            </p>
          ))}
      </section>
    </>
  );
};

export default DisplayStudents;
