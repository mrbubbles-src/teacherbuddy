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

/**
 * Reducer function to manage the state of a local storage object.
 *
 * @param state - The current state of the local storage object.
 * @param action - The action to be performed on the state, containing a type and an optional payload.
 *
 * @returns The updated state after applying the specified action.
 *
 * ### Action Types:
 * - `ACTIONS.ADD_STUDENT`: Adds a single student name to the `studentNames` array.
 * - `ACTIONS.ADD_STUDENTS`: Adds multiple student names to the `studentNames` array.
 * - `ACTIONS.EDIT_STUDENT`: Edits a student name at a specific index in the `studentNames` array.
 * - `ACTIONS.REMOVE_STUDENT`: Removes a student name from the `studentNames` array, ignoring case.
 * - `ACTIONS.CLEAR_STUDENTS`: Clears all student names from the `studentNames` array.
 * - `ACTIONS.ADD_QUESTION`: Adds a single quiz question to the `quizQuestions` array.
 * - `ACTIONS.ADD_QUESTIONS`: Adds multiple quiz questions to the `quizQuestions` array.
 * - `ACTIONS.EDIT_QUESTION`: Edits a quiz question at a specific index in the `quizQuestions` array.
 * - `ACTIONS.REMOVE_QUESTION`: Removes a quiz question from the `quizQuestions` array, ignoring case.
 * - `ACTIONS.CLEAR_QUESTIONS`: Clears all quiz questions from the `quizQuestions` array.
 * - `default`: Returns the current state if the action type is not recognized.
 *
 * ### Payload Types:
 * - `string`: Used for adding or removing a single student name or quiz question.
 * - `string[]`: Used for adding multiple student names or quiz questions.
 * - `{ index: number; newName?: string; newQuestion?: string }`: Used for editing a student name or quiz question at a specific index.
 * - `undefined`: Used for actions that do not require a payload (e.g., clearing all students or questions).
 *
 * ### State Interface:
 * - `ISaveToLocalStorage`: Represents the structure of the state object, which includes:
 *   - `studentNames: string[]`: An array of student names.
 *   - `quizQuestions: string[]`: An array of quiz questions.
 *
 * ### Example Usage:
 * ```typescript
 * const newState = reducer(currentState, {
 *   type: ACTIONS.ADD_STUDENT,
 *   payload: "John Doe",
 * });
 * ```
 */
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
