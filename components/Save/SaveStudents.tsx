'use client';

import { useState } from 'react';
import { useTeacherBuddy } from '@/context/TeacherBuddyContext';
import { ACTIONS } from '@/utils/reducer/reducer';

const SaveStudents = () => {
  const { dispatch } = useTeacherBuddy();
  const [currentStudentName, setCurrentStudentName] = useState<
    string | Array<string>
  >('');

  const storeStudentsHandler = () => {
    if (Array.isArray(currentStudentName)) {
      dispatch({ type: ACTIONS.ADD_STUDENTS, payload: currentStudentName });
      setCurrentStudentName('');
      return;
    }
    dispatch({ type: ACTIONS.ADD_STUDENT, payload: currentStudentName });
    setCurrentStudentName('');
  };

  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <input
        className="input-student"
        type="text"
        value={currentStudentName}
        onChange={(event) => {
          const value: string = event.target.value;
          if (value.includes(',')) {
            setCurrentStudentName(
              value
                .split(',')
                .map(
                  (name) =>
                    (name.trim().at(0)?.toUpperCase() || '') +
                    name.trim().slice(1),
                ),
            );
            return;
          }
          setCurrentStudentName(
            (value.trim().at(0)?.toUpperCase() || '') + value.trim().slice(1),
          );
        }}
        placeholder="Input a Student's Name"
      />
      <button
        className="submit-student btn"
        type="submit"
        onClick={storeStudentsHandler}>
        Submit
      </button>
    </form>
  );
};

export default SaveStudents;
