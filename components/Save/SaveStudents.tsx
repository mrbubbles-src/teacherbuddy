'use client';

import { useState } from 'react';
import { useTeacherBuddy } from '@/context/TeacherBuddyContext';
import { ACTIONS } from '@/utils/reducer/reducer';

const SaveStudents = () => {
  const { dispatch } = useTeacherBuddy();
  const [currentStudentName, setCurrentStudentName] = useState<
    string | Array<string>
  >('');

  const onChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    const value: string = event.target.value;
    if (value.includes(',')) {
      setCurrentStudentName(value.split(','));
      return;
    }
    setCurrentStudentName(value);
  };

  const storeStudentsHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (currentStudentName.length === 0) return;

    if (Array.isArray(currentStudentName)) {
      const cleanedStudentNames: Array<string> = currentStudentName
        .map((name) => name.trim())
        .filter((name) => name !== '');
      dispatch({ type: ACTIONS.ADD_STUDENTS, payload: cleanedStudentNames });
      setCurrentStudentName('');
      return;
    }
    dispatch({ type: ACTIONS.ADD_STUDENT, payload: currentStudentName.trim() });
    setCurrentStudentName('');
  };

  return (
    <form onSubmit={storeStudentsHandler}>
      <input
        className="input-student"
        type="text"
        value={currentStudentName}
        onChange={onChangeHandler}
        placeholder="Input a Student's Name"
      />
      <button className="submit-student btn" type="submit">
        Submit
      </button>
    </form>
  );
};

export default SaveStudents;
