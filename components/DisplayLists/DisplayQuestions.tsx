'use client';

import { useTeacherBuddy } from '@/context/TeacherBuddyContext';
import RemoveSingle from '../RemoveSingle/RemoveSingle';
import ClearAll from '../ClearAll/ClearAll';
import { ACTIONS } from '@/utils/reducer/reducer';
import EditContent from '../EditContent/EditContent';

const DisplayQuestions = () => {
  const { state } = useTeacherBuddy();

  if (!state) {
    return null;
  }

  const questions: Array<string> = state.quizQuestions;

  return (
    <>
      <ClearAll typeAction={ACTIONS.CLEAR_QUESTIONS} sectionName="Questions" />
      <section className="flex flex-wrap gap-3">
        {questions &&
          questions.map((question, index) => (
            <p
              key={index}
              className="m-1 rounded-2xl border border-brand-primary p-2">
              {question}
              {
                <EditContent
                  typeAction={ACTIONS.EDIT_QUESTION}
                  payloadToBeEdited={question}
                  index={index}
                />
              }
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
