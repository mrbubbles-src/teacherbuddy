'use client';

import { useState } from 'react';
import { useTeacherBuddy } from '@/context/TeacherBuddyContext';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const EditContent = ({
  typeAction,
  payloadToBeEdited,
  index,
}: {
  typeAction: string;
  payloadToBeEdited: string;
  index: number;
}) => {
  const { dispatch } = useTeacherBuddy();
  const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState(payloadToBeEdited);

  /**
   * Handles the save action for editing content. Depending on the `typeAction`,
   * it constructs a payload for either editing a student's name or a question,
   * and dispatches the corresponding action to update the state.
   *
   * @returns void
   *
   * @remarks
   * - If `typeAction` is `'EDIT_STUDENT'`, the payload will include the `index` and `newName`.
   * - If `typeAction` is not `'EDIT_STUDENT'`, the payload will include the `index` and `newQuestion`.
   *
   * @example
   * saveEditHandler();
   */
  const saveEditHandler = (): void => {
    const payload =
      typeAction === 'EDIT_STUDENT'
        ? { index, newName: newContent }
        : { index, newQuestion: newContent };

    dispatch({
      type: typeAction,
      payload,
    });
    setIsEditing(false);
  };

  return isEditing ? (
    <span>
      <input
        type="text"
        value={newContent}
        onChange={(event) => setNewContent(event.target.value)}
        className="rounded border p-1"
      />
      <button className="ml-2 text-green-500" onClick={saveEditHandler}>
        Save
      </button>
      <button className="ml-2 text-red-500" onClick={() => setIsEditing(false)}>
        Cancel
      </button>
    </span>
  ) : (
    <span
      className="ml-5 cursor-pointer rounded-lg border-2 border-brand-secondary p-1 text-xs text-brand-secondary"
      onClick={() => setIsEditing(true)}>
      <FontAwesomeIcon className="" icon={faPenToSquare} />
    </span>
  );
};

export default EditContent;
