import DisplayQuestions from '@/components/DisplayLists/DisplayQuestions';
import DisplayRandomData from '@/components/DisplayLists/DisplayRandomData';
import DisplayStudents from '@/components/DisplayLists/DisplayStudents';

const HomePage = () => {
  return (
    <>
      <DisplayRandomData category="students" />
      <DisplayRandomData category="questions" />

      <DisplayStudents />
      <DisplayQuestions />
    </>
  );
};

export default HomePage;
