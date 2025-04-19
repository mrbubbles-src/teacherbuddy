'use client';

import { useState } from 'react';
import { useTeacherBuddy } from '@/context/TeacherBuddyContext';
import { ACTIONS } from '@/utils/reducer/reducer';

/**
 * The `SaveStudents` component provides a form for adding student names to the application state.
 * It supports adding a single student name or multiple names separated by commas.
 *
 * Features:
 * - Handles input changes to dynamically update the state with the current student name(s).
 * - Trims and filters out empty names when submitting multiple names.
 * - Dispatches actions to add a single student or multiple students to the application state.
 *
 * Usage:
 * - Enter a single student's name or multiple names separated by commas in the input field.
 * - Click the "Submit" button to save the student(s).
 *
 * State:
 * - `currentStudentName`: Stores the current input value, which can be a string or an array of strings.
 *
 * Handlers:
 * - `onChangeHandler`: Updates the state with the input value, splitting it into an array if commas are detected.
 * - `storeStudentsHandler`: Processes the input value, cleans it, and dispatches the appropriate action to save the student(s).
 *
 * Dependencies:
 * - `useTeacherBuddy`: Custom hook to access the application's dispatch function.
 * - `ACTIONS`: Enum or object containing action types for dispatching.
 *
 * @returns A form element with an input field and a submit button for adding student names.
 */
const SaveStudents = () => {
  const { dispatch } = useTeacherBuddy();
  const [currentStudentName, setCurrentStudentName] = useState<
    string | Array<string>
  >('');

  /**
   * Handles the change event for an input element.
   * Updates the current student name state based on the input value.
   * If the input value contains a comma, it splits the value into an array
   * and sets the state with the resulting array. Otherwise, it sets the state
   * with the input value as a string.
   *
   * @param event - The change event triggered by the input element.
   */
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

  /**
   * Handles the submission of the form to store student names.
   *
   * This function prevents the default form submission behavior and validates
   * the `currentStudentName` input. If `currentStudentName` is an array, it
   * trims and filters out empty names before dispatching an action to add
   * multiple students. If it is a single string, it trims the name and dispatches
   * an action to add a single student. After processing, it resets the
   * `currentStudentName` state.
   *
   * @param event - The form submission event.
   */
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
