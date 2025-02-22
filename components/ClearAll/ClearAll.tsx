import { useTeacherBuddy } from '@/context/TeacherBuddyContext';

const ClearAll = ({
  typeAction,
  sectionName,
}: {
  typeAction: string;
  sectionName: string;
}) => {
  const { dispatch } = useTeacherBuddy();
  const clearAllHandler = () => {
    dispatch({ type: typeAction });
  };
  return (
    <button onClick={clearAllHandler}>Clear All {sectionName || null}</button>
  );
};

export default ClearAll;
