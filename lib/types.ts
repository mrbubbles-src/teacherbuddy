export interface IQuizQuestion {
  question: string;
  answer: string;
}

export interface ISaveToLocalStorage {
  studentNames: string[];
  quizQuestions: IQuizQuestion[];
}

export interface IAction<T> {
  type: string;
  payload?: T;
}

export interface ITeacherBuddyContextType {
  state: ISaveToLocalStorage | undefined;
  dispatch: React.Dispatch<
    IAction<string | IQuizQuestion | string[] | IQuizQuestion[] | undefined>
  >;
}
