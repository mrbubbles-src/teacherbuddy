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

/**
 * Provides the TeacherBuddy context to its children, managing state and functionality
 * for handling students and quiz questions.
 *
 * @param props - The props for the provider component.
 * @param children - The child components that will have access to the context.
 *
 * @returns The context provider wrapping the children.
 *
 * @remarks
 * - Initializes state using a reducer and manages side effects with `useEffect`.
 * - Loads students and questions from local storage on mount and updates the state.
 * - Saves students and quiz questions to local storage whenever they change.
 * - Provides functionality to generate random data (students or questions) and reset the random data.
 *
 * @context
 * - `state`: The current state of the application.
 * - `dispatch`: The dispatch function to update the state.
 * - `randomGenerator`: A function to generate random data (students or questions) based on the category.
 * - `randomData`: The current list of remaining random data.
 * - `resetRandomData`: A function to reset the random data to its initial state.
 * - `displaySelectedData`: The currently selected random data or a message indicating all data has been used.
 *
 * @example
 * ```tsx
 * import { TeacherBuddyProvider } from './TeacherBuddyContext';
 *
 * const App = () => (
 *   <TeacherBuddyProvider>
 *     <YourComponent />
 *   </TeacherBuddyProvider>
 * );
 * ```
 */
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

  /**
   * * Currently, no matter what data is used, if the data is used in more than one ('DisplayRandomData') component, both
   * * display the same data.
   * TODO: Refactor random generation to save data in an obj to save both names and questions seperately in one state variable.
   * TODO: Return said data depending on what category was passed with 'displaySelectedData'
   * */
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

/**
 * Custom hook to access the TeacherBuddy context.
 *
 * This hook provides access to the `TeacherBuddyContext` and ensures that it is used
 * within a `TeacherBuddyProvider`. If the hook is called outside of a valid provider,
 * it will throw an error.
 *
 * @throws `Error` If the hook is used outside of a `TeacherBuddyProvider`.
 * @returns `ITeacherBuddyContextType` The context value provided by `TeacherBuddyProvider`.
 */
export const useTeacherBuddy = (): ITeacherBuddyContextType => {
  const context = useContext(TeacherBuddyContext);
  if (!context) {
    throw new Error(
      'useTeacherBuddy must be used within a TeacherBuddyProvider',
    );
  }
  return context;
};
