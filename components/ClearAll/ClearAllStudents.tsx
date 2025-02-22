import { useTeacherBuddy } from '@/context/TeacherBuddyContext';
import { ACTIONS } from '@/utils/reducer/reducer';

const ClearAllStudents = () => {
  const { dispatch } = useTeacherBuddy();
  const clearAllHandler = () => {
    dispatch({ type: ACTIONS.CLEAR_STUDENTS });
  };
  return <button onClick={clearAllHandler}>Clear All Students</button>;
};

export default ClearAllStudents;
