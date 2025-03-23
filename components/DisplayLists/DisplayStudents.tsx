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

  const formatName = (name: string) => {
    return (name.at(0)?.toUpperCase() || '') + name.slice(1);
  };

  return (
    <>
      <ClearAll typeAction={ACTIONS.CLEAR_STUDENTS} sectionName="Students" />
      <section className="flex flex-wrap gap-3">
        {sortedStudents &&
          sortedStudents.map((student, index) => (
            <p
              className="m-1 rounded-2xl border border-brand-primary p-2"
              key={index}>
              {formatName(student)}
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
