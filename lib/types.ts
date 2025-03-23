// export interface IQuizQuestion {
//   question: string;
//   answer: string;
// }

export interface ISaveToLocalStorage {
  studentNames: string[];
  quizQuestions: string[];
  // quizQuestions: IQuizQuestion[];
}

export interface IAction<T> {
  type: string;
  payload?: T;
}

export interface ITeacherBuddyContextType {
  state: ISaveToLocalStorage | undefined;
  dispatch: React.Dispatch<
    IAction<
      | string
      | /*IQuizQuestion |*/ string[] /*IQuizQuestion[] |*/
      | { index: number; newName?: string; newQuestion?: string }
      | undefined
    >
  >;
  randomGenerator: (category: TRandomGenerator) => string | null;
  resetRandomData: () => void;
  randomData: Array<string> | null;
  displaySelectedData: string | null;
}

export type TRandomGenerator = 'students' | 'questions';
