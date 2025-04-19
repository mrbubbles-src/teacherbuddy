import { useTeacherBuddy } from '@/context/TeacherBuddyContext';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * A React component that renders a clickable icon for removing a specific item.
 * This component dispatches an action to remove an item from the state when clicked.
 *
 * @param typeAction - string - The type of the action to be dispatched.
 * @param payloadToBeRemoved - string - The payload to be removed, passed to the dispatch function.
 *
 * @returns A styled span element containing a trash can icon, which triggers the removal action on click.
 */
const RemoveSingle = ({
  typeAction,
  payloadToBeRemoved,
}: {
  typeAction: string;
  payloadToBeRemoved: string;
}) => {
  const { dispatch } = useTeacherBuddy();
  /**
   * Handles the removal of an item by dispatching an action to the state management system.
   *
   * @remarks
   * This function dispatches an action with a specified type and payload to remove an item
   * from the application's state. Ensure that `typeAction` and `payloadToBeRemoved` are
   * properly defined and passed to the component.
   *
   */
  const removeHandler = () => {
    dispatch({ type: typeAction, payload: payloadToBeRemoved });
  };

  return (
    <span
      className="ml-5 cursor-pointer rounded-lg border-2 border-red-500 p-1 text-xs text-red-500"
      onClick={removeHandler}>
      <FontAwesomeIcon className="" icon={faTrashCan} />
    </span>
  );
};

export default RemoveSingle;
