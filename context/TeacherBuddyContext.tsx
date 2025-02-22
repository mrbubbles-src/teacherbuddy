'use client';
import { createContext, useContext, useReducer, useEffect } from 'react';
import { reducer, initialState, ACTIONS } from '@/utils/reducer/reducer';
import { getStudents } from '@/utils/getLocalStorage/getLocalStorage';
import { saveStudentsToLocalStorage } from '@/utils/saveToLocalStorage/saveToLocalStorage';
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
    if (localStudents.length > 0) {
      dispatch({ type: ACTIONS.ADD_STUDENTS, payload: localStudents });
    }
  }, []);

  useEffect(() => {
    saveStudentsToLocalStorage(state);
    window.dispatchEvent(new Event('storage'));
  }, [state]);

  return (
    <TeacherBuddyContext.Provider value={{ state, dispatch }}>
      {children}
    </TeacherBuddyContext.Provider>
  );
};

export const useTeacherBuddy = () => useContext(TeacherBuddyContext);
