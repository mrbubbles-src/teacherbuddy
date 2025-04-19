'use client';

import { useState } from 'react';
import { useTeacherBuddy } from '@/context/TeacherBuddyContext';
import { ACTIONS } from '@/utils/reducer/reducer';

/**
 * The `SaveQuestions` component provides a form for users to input and save questions.
 * It supports both single questions and multiple questions separated by commas.
 *
 * - Single questions are trimmed and dispatched as a single payload.
 * - Multiple questions are split by commas, trimmed, and dispatched as an array payload.
 *
 * The component uses the `useTeacherBuddy` context to dispatch actions for storing questions.
 *
 * @component
 * @returns  A form with an input field and a submit button for saving questions.
 *
 * @example
 * <SaveQuestions />
 *
 * @remarks
 * - The input field accepts a string or a comma-separated list of strings.
 * - The form submission triggers the appropriate dispatch action based on the input type.
 *
 * @dependencies
 * - `useTeacherBuddy`: A custom hook for accessing the application's dispatch function.
 * - `ACTIONS`: An object containing action types for dispatching.
 *
 * @internal
 * This component is part of the `Save` feature in the `teacherbuddy` project.
 */
const SaveQuestions = () => {
  const { dispatch } = useTeacherBuddy();
  const [currentQuestion, setCurrentQuestion] = useState<
    string | Array<string>
  >('');

  /**
   * Handles the change event for an input element and updates the current question state.
   *
   * @param event - The change event triggered by the input element.
   *
   * The function checks if the input value contains a comma. If it does, the value is split
   * into an array using the comma as a delimiter and the resulting array is set as the current
   * question state. Otherwise, the input value is directly set as the current question state.
   */
  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value: string = event.target.value;
    if (value.includes(',')) {
      setCurrentQuestion(value.split(','));
      return;
    }
    setCurrentQuestion(value);
  };
  /**
   * Handles the submission of questions by processing and dispatching them to the store.
   *
   * This function prevents the default form submission behavior, processes the current question(s),
   * and dispatches the appropriate action to update the state. If `currentQuestion` is an array,
   * it trims and filters out empty strings before dispatching an action to add multiple questions.
   * Otherwise, it trims the single question and dispatches an action to add it.
   *
   * @param event - The form submission event.
   */
  const storeQuestionsHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (Array.isArray(currentQuestion)) {
      const cleanedQuestions: Array<string> = currentQuestion
        .map((question) => question.trim())
        .filter((question) => question !== '');
      dispatch({ type: ACTIONS.ADD_QUESTIONS, payload: cleanedQuestions });
      setCurrentQuestion('');
      return;
    }
    dispatch({ type: ACTIONS.ADD_QUESTION, payload: currentQuestion.trim() });
    setCurrentQuestion('');
  };

  return (
    <form onSubmit={storeQuestionsHandler}>
      <input
        className="input-student"
        type="text"
        value={currentQuestion}
        onChange={onChangeHandler}
        placeholder="Input a Question"
      />
      <button className="submit-question btn" type="submit">
        Submit
      </button>
    </form>
  );
};

export default SaveQuestions;
