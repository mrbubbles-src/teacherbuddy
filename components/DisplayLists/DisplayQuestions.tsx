'use client';

import { useTeacherBuddy } from '@/context/TeacherBuddyContext';
import RemoveSingle from '../RemoveSingle/RemoveSingle';
import ClearAll from '../ClearAll/ClearAll';
import { ACTIONS } from '@/utils/reducer/reducer';

const DisplayQuestions = () => {
  const { state } = useTeacherBuddy();

  if (!state) {
    return null;
  }

  const questions: Array<string> = state.quizQuestions;

  return (
    <>
      <ClearAll typeAction={ACTIONS.CLEAR_QUESTIONS} sectionName="Questions" />
      <section>
        {questions &&
          questions.map((question, index) => (
            <p key={index}>
              {question}
              {
                <RemoveSingle
                  typeAction={ACTIONS.REMOVE_QUESTION}
                  payloadToBeRemoved={question}
                />
              }
            </p>
          ))}
      </section>
    </>
  );
};

export default DisplayQuestions;
