'use client';

import { useTeacherBuddy } from '@/context/TeacherBuddyContext';
import RemoveSingle from '../RemoveSingle/RemoveSingle';
import ClearAll from '../ClearAll/ClearAll';
import { ACTIONS } from '@/utils/reducer/reducer';

const DisplayStudents = () => {
  const { state } = useTeacherBuddy();

  if (!state) {
    return null;
  }

  const students: Array<string> = state.studentNames;

  const sortedStudents = [...students].sort((a, b) => a.localeCompare(b));

  return (
    <>
      <ClearAll typeAction={ACTIONS.CLEAR_STUDENTS} sectionName="Students" />
      <section
      // className="border-3 flex h-[100vh] gap-3"
      >
        {sortedStudents &&
          sortedStudents.map((student, index) => (
            <p
              // className="rounded-2xl border border-brand-primary p-2"
              key={index}>
              {student}
              {
                <RemoveSingle
                  typeAction={ACTIONS.REMOVE_STUDENT}
                  payloadToBeRemoved={student}
                />
              }
            </p>
          ))}
      </section>
    </>
  );
};

export default DisplayStudents;
