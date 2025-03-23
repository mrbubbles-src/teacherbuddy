'use client';

import { useState } from 'react';
import { useTeacherBuddy } from '@/context/TeacherBuddyContext';
import { ACTIONS } from '@/utils/reducer/reducer';

const SaveQuestions = () => {
  const { dispatch } = useTeacherBuddy();
  const [currentQuestion, setCurrentQuestion] = useState<
    string | Array<string>
  >('');

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value: string = event.target.value;
    if (value.includes(',')) {
      setCurrentQuestion(value.split(','));
      return;
    }
    setCurrentQuestion(value);
  };
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
