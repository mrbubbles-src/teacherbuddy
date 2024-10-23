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
  payload: T;
}
