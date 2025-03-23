'use client';

import { useTeacherBuddy } from '@/context/TeacherBuddyContext';
import RemoveSingle from '../RemoveSingle/RemoveSingle';
import ClearAll from '../ClearAll/ClearAll';
import { ACTIONS } from '@/utils/reducer/reducer';
import EditContent from '../EditContent/EditContent';

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
      <ul className="flex flex-wrap gap-3">
        {sortedStudents &&
          sortedStudents.map((student, index) => (
            <li
              className="m-1 rounded-2xl border border-brand-primary p-2"
              key={index}>
              {formatName(student)}
              {
                <EditContent
                  typeAction={ACTIONS.EDIT_STUDENT}
                  payloadToBeEdited={student}
                  index={index}
                />
              }
              {
                <RemoveSingle
                  typeAction={ACTIONS.REMOVE_STUDENT}
                  payloadToBeRemoved={student}
                />
              }
            </li>
          ))}
      </ul>
    </>
  );
};

export default DisplayStudents;
