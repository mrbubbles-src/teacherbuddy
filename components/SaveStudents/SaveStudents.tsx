'use client';

import { useReducer, useState, useEffect } from 'react';
import { reducer, initialState, ACTIONS } from '@/utils/reducer/reducer';
import { saveStudentsToLocalStorage } from '@/utils/saveToLocalStorage/saveToLocalStorage';
import { getStudents } from '@/utils/getLocalStorage/getLocalStorage';

const SaveStudents = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [currentStudentName, setCurrentStudentName] = useState<string>('');

  useEffect(() => {
    const localStudents = getStudents();
    if (localStudents.length > 0) {
      dispatch({ type: ACTIONS.ADD_STUDENTS, payload: localStudents });
    }
  }, []);

  useEffect(() => {
    saveStudentsToLocalStorage(state);
  }, [state]);

  const saveToStorage = () => {
    dispatch({ type: ACTIONS.ADD_STUDENT, payload: currentStudentName });
    setCurrentStudentName('');
  };

  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <input
        className="input-student"
        type="text"
        value={currentStudentName}
        onChange={(event) => setCurrentStudentName(event.target.value)}
        placeholder="Input a Student's Name"
      />
      <button
        className="submit-student btn"
        type="submit"
        onClick={saveToStorage}>
        Submit Student
      </button>
    </form>
  );
};

export default SaveStudents;
