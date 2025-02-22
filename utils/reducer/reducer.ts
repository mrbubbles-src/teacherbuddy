import { IAction, IQuizQuestion, ISaveToLocalStorage } from '@/lib/types';

export const ACTIONS = {
  ADD_STUDENT: 'ADD_STUDENT',
  ADD_STUDENTS: 'ADD_STUDENTS',
  ADD_QUESTION: 'ADD_QUESTION',
  ADD_QUESTIONS: 'ADD_QUESTIONS',
};

export const initialState: ISaveToLocalStorage = {
  studentNames: [],
  quizQuestions: [],
};

export const reducer = (
  state: ISaveToLocalStorage,
  action: IAction<string | IQuizQuestion | string[] | IQuizQuestion[]>,
): ISaveToLocalStorage => {
  switch (action.type) {
    case ACTIONS.ADD_STUDENT:
      return {
        ...state,
        studentNames: [...state.studentNames, action.payload as string],
      };
    case ACTIONS.ADD_STUDENTS:
      return {
        ...state,
        studentNames: [...state.studentNames, ...(action.payload as string[])],
      };
    case ACTIONS.ADD_QUESTION:
      return {
        ...state,
        quizQuestions: [
          ...state.quizQuestions,
          action.payload as IQuizQuestion,
        ],
      };
    case ACTIONS.ADD_QUESTIONS:
      return {
        ...state,
        quizQuestions: [
          ...state.quizQuestions,
          ...(action.payload as IQuizQuestion[]),
        ],
      };
    default:
      return state;
  }
};
