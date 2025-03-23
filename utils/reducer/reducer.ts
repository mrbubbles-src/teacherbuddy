import { IAction, /*IQuizQuestion,*/ ISaveToLocalStorage } from '@/lib/types';

export const ACTIONS = {
  ADD_STUDENT: 'ADD_STUDENT',
  ADD_STUDENTS: 'ADD_STUDENTS',
  EDIT_STUDENT: 'EDIT_STUDENT',
  REMOVE_STUDENT: 'REMOVE_STUDENT',
  CLEAR_STUDENTS: 'CLEAR_STUDENTS',
  ADD_QUESTION: 'ADD_QUESTION',
  ADD_QUESTIONS: 'ADD_QUESTIONS',
  EDIT_QUESTION: 'EDIT_QUESTION',
  REMOVE_QUESTION: 'REMOVE_QUESTION',
  CLEAR_QUESTIONS: 'CLEAR_QUESTIONS',
};

export const initialState: ISaveToLocalStorage = {
  studentNames: [],
  quizQuestions: [],
};

export const reducer = (
  state: ISaveToLocalStorage,
  action: IAction<
    | string
    | /*IQuizQuestion |*/ string[]
    | { index: number; newName?: string; newQuestion?: string }
    | undefined
  >,
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
    case ACTIONS.EDIT_STUDENT:
      return {
        ...state,
        studentNames: state.studentNames.map((name, index) =>
          index === (action.payload as { index: number; newName: string }).index
            ? (action.payload as { index: number; newName: string }).newName
            : name,
        ),
      };
    case ACTIONS.REMOVE_STUDENT:
      return {
        ...state,
        studentNames: state.studentNames.filter(
          (name) =>
            name.toLocaleLowerCase() !==
            (action.payload as string).toLocaleLowerCase(),
        ),
      };
    case ACTIONS.CLEAR_STUDENTS:
      return {
        ...state,
        studentNames: [],
      };
    case ACTIONS.ADD_QUESTION:
      return {
        ...state,
        quizQuestions: [
          ...state.quizQuestions,
          action.payload as string,
          // action.payload as IQuizQuestion,
        ],
      };
    case ACTIONS.ADD_QUESTIONS:
      return {
        ...state,
        quizQuestions: [
          ...state.quizQuestions,
          ...(action.payload as string[]),
          // ...(action.payload as IQuizQuestion[]),
        ],
      };
    case ACTIONS.EDIT_QUESTION:
      return {
        ...state,
        quizQuestions: state.quizQuestions.map((question, index) =>
          index ===
          (action.payload as { index: number; newQuestion: string }).index
            ? (action.payload as { index: number; newQuestion: string })
                .newQuestion
            : question,
        ),
      };
    case ACTIONS.REMOVE_QUESTION:
      return {
        ...state,
        quizQuestions: state.quizQuestions.filter(
          (question) =>
            question.toLocaleLowerCase() !==
            (action.payload as string).toLocaleLowerCase(),
        ),
      };
    case ACTIONS.CLEAR_QUESTIONS:
      return {
        ...state,
        quizQuestions: [],
      };
    default:
      return state;
  }
};
