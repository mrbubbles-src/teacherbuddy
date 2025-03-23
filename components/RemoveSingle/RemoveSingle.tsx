import { useTeacherBuddy } from '@/context/TeacherBuddyContext';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const RemoveSingle = ({
  typeAction,
  payloadToBeRemoved,
}: {
  typeAction: string;
  payloadToBeRemoved: string;
}) => {
  const { dispatch } = useTeacherBuddy();
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
