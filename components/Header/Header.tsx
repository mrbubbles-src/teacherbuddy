import SaveQuestions from '../Save/SaveQuestions';
import SaveStudents from '../Save/SaveStudents';

const Header = () => {
  return (
    <header>
      <SaveStudents />
      <SaveQuestions />
    </header>
  );
};

export default Header;
