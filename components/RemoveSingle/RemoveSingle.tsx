import { useTeacherBuddy } from '@/context/TeacherBuddyContext';

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
      className="ml-5 cursor-pointer border-2 border-red-500 p-1 text-xs"
      onClick={removeHandler}>
      ❌
    </span>
  );
};

export default RemoveSingle;
