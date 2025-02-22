import { useTeacherBuddy } from '@/context/TeacherBuddyContext';
import { ACTIONS } from '@/utils/reducer/reducer';

const RemoveSingleStudent = ({ student }: { student: string }) => {
  const { dispatch } = useTeacherBuddy();
  const removeHandler = () => {
    dispatch({ type: ACTIONS.REMOVE_STUDENT, payload: student });
  };

  return (
    <span
      className="ml-5 cursor-pointer border-2 border-red-500 p-1 text-xs"
      onClick={removeHandler}>
      ❌
    </span>
  );
};

export default RemoveSingleStudent;
