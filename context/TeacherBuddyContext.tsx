'use client';
import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
} from 'react';
import { reducer, initialState, ACTIONS } from '@/utils/reducer/reducer';
import {
  getQuestions,
  getStudents,
} from '@/utils/getLocalStorage/getLocalStorage';
import {
  saveQuizToLocalStorage,
  saveStudentsToLocalStorage,
} from '@/utils/saveToLocalStorage/saveToLocalStorage';
import { ITeacherBuddyContextType, TRandomGenerator } from '@/lib/types';

const TeacherBuddyContext = createContext<ITeacherBuddyContextType | undefined>(
  undefined,
);

export const TeacherBuddyProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const localStudents: Array<string> = getStudents();
    const localQuestions: Array<string> = getQuestions();
    if (localStudents.length > 0) {
      dispatch({ type: ACTIONS.ADD_STUDENTS, payload: localStudents });
    }
    if (localQuestions.length > 0) {
      dispatch({ type: ACTIONS.ADD_QUESTIONS, payload: localQuestions });
    }
  }, []);

  useEffect(() => {
    saveStudentsToLocalStorage(state);
    window.dispatchEvent(new Event('storage'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.studentNames]);

  useEffect(() => {
    saveQuizToLocalStorage(state);
    window.dispatchEvent(new Event('storage'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.quizQuestions]);

  const [randomData, setRandomData] = useState<Array<string> | null>(null);
  const [displaySelectedData, setDisplaySelectedData] = useState<string | null>(
    null,
  );
  const randomGenerator = (category: TRandomGenerator): string | null => {
    if (randomData === null) {
      const initialData =
        category === 'students'
          ? [...state.studentNames]
          : category === 'questions'
            ? [...state.quizQuestions]
            : [];
      if (initialData.length === 0) {
        setDisplaySelectedData(
          `${category === 'students' ? "You've selected all students! Press 'Reset' to start over." : "All questions done! Press 'Reset' to start over."}`,
        );
        return null;
      }
      const randomIndex = Math.floor(Math.random() * initialData.length);
      const randomElement = initialData[randomIndex];
      setDisplaySelectedData(randomElement);
      const updatedData = initialData.filter(
        (_, index) => index !== randomIndex,
      );
      setRandomData(updatedData);
      return randomElement;
    }
    if (randomData.length > 0) {
      const randomIndex = Math.floor(Math.random() * randomData.length);
      const randomElement = randomData[randomIndex];
      setDisplaySelectedData(randomElement);

      const updatedData = randomData.filter(
        (_, index) => index !== randomIndex,
      );
      setRandomData(updatedData);
      return randomElement;
    }
    setDisplaySelectedData(
      `${category === 'students' ? "You've selected all students! Press 'Reset' to start over." : "All questions done! Press 'Reset' to start over."}`,
    );
    return null;
  };
  const resetRandomData = (): void => {
    setRandomData(null);
    setDisplaySelectedData(null);
  };

  console.log('randomData', randomData);
  console.log('displaySelectedData', displaySelectedData);
  return (
    <TeacherBuddyContext.Provider
      value={{
        state,
        dispatch,
        randomGenerator,
        randomData,
        resetRandomData,
        displaySelectedData,
      }}>
      {children}
    </TeacherBuddyContext.Provider>
  );
};

export const useTeacherBuddy = (): ITeacherBuddyContextType => {
  const context = useContext(TeacherBuddyContext);
  if (!context) {
    throw new Error(
      'useTeacherBuddy must be used within a TeacherBuddyProvider',
    );
  }
  return context;
};
