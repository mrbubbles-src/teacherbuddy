'use client';
import { createContext, useContext, useReducer, useEffect } from 'react';
import { reducer, initialState, ACTIONS } from '@/utils/reducer/reducer';
import {
  getQuestions,
  getStudents,
} from '@/utils/getLocalStorage/getLocalStorage';
import {
  saveQuizToLocalStorage,
  saveStudentsToLocalStorage,
} from '@/utils/saveToLocalStorage/saveToLocalStorage';
import { ITeacherBuddyContextType } from '@/lib/types';

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
    const localStudents = getStudents();
    const localQuestions = getQuestions();
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
  }, [state.studentNames]);

  useEffect(() => {
    saveQuizToLocalStorage(state);
    window.dispatchEvent(new Event('storage'));
  }, [state.quizQuestions]);

  return (
    <TeacherBuddyContext.Provider value={{ state, dispatch }}>
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
