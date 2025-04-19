// export interface IQuizQuestion {
//   question: string;
//   answer: string;
// }

/**
 * Represents the app state structure that can be persisted in local storage.
 * Includes `studentNames` and `quizQuestions` as `string[ ]`.
 */
export interface ISaveToLocalStorage {
  /**
   * An array of student names to be stored.
   */
  studentNames: string[];

  /**
   * An Array of quiz questions as plain strings.
   * @todo Replace with a specific type like `IQuizQuestion[]` for better structure.
   */
  quizQuestions: string[];
}

/**
 * Generic action type used in reducer logic.
 * @template T - The shape of the payload passed with the action.
 */
export interface IAction<T> {
  type: string;
  payload?: T;
}

/**
 * Represents the context type for the TeacherBuddy application.
 */
export interface ITeacherBuddyContextType {
  /**
   * The current state of the application, which can be saved to local storage.
   */
  state: ISaveToLocalStorage | undefined;

  /**
   * Dispatch function for triggering state updates.
   * Supports different payload types depending on the action:
   * - `string`
   * - `string[]`
   * - `{ index: number; newName?: string; newQuestion?: string }`
   * - `undefined`
   */
  dispatch: React.Dispatch<
    IAction<
      | string
      | string[]
      | { index: number; newName?: string; newQuestion?: string }
      | undefined
    >
  >;

  /**
   * Generates a random string based on the provided category.
   *
   * @param category - The category used for random generation.
   * @returns A randomly generated string or `null` if no data is available.
   */
  randomGenerator: (category: TRandomGenerator) => string | null;

  /**
   * Resets the random data to its initial state.
   */
  resetRandomData: () => void;

  /**
   * Full list of currently available random entries (e.g. students or questions).
   * Null if no data is available.
   */
  randomData: Array<string> | null;

  /**
   * The currently selected random entry to be displayed.
   * Null if nothing is selected.
   */
  displaySelectedData: string | null;
}

/**
 * Represents the type of random generator used in the application.
 *
 * - `'students'`: Indicates a random generator for selecting students.
 * - `'questions'`: Indicates a random generator for selecting questions.
 */
export type TRandomGenerator = 'students' | 'questions';
