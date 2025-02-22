'use client';

import { useState } from 'react';
import { useTeacherBuddy } from '@/context/TeacherBuddyContext';
import { ACTIONS } from '@/utils/reducer/reducer';

const SaveQuestions = () => {
  const { dispatch } = useTeacherBuddy();
  const [currentQuestion, setCurrentQuestion] = useState<
    string | Array<string>
  >('');

  const storeQuestionsHandler = () => {
    if (Array.isArray(currentQuestion)) {
      dispatch({ type: ACTIONS.ADD_QUESTIONS, payload: currentQuestion });
      setCurrentQuestion('');
      return;
    }
    dispatch({ type: ACTIONS.ADD_QUESTION, payload: currentQuestion });
    setCurrentQuestion('');
  };

  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <input
        className="input-student"
        type="text"
        value={currentQuestion}
        onChange={(event) => {
          const value: string = event.target.value;
          if (value.includes(',')) {
            setCurrentQuestion(value.split(',').map((name) => name.trim()));
            return;
          }
          setCurrentQuestion(value.trim());
        }}
        placeholder="Input a Question"
      />
      <button
        className="submit-question btn"
        type="submit"
        onClick={storeQuestionsHandler}>
        Submit
      </button>
    </form>
  );
};

export default SaveQuestions;
