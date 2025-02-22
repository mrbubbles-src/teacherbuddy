import DisplayQuestions from '@/components/DisplayLists/DisplayQuestions';
import DisplayStudents from '@/components/DisplayLists/DisplayStudents';
import SaveQuestions from '@/components/Save/SaveQuestions';

const HomePage = () => {
  return (
    <>
      <DisplayStudents />
      <SaveQuestions />
      <DisplayQuestions />
    </>
  );
};

export default HomePage;
