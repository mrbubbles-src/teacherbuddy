import type { ReactNode } from 'react';

type PageHelp = {
  purpose: ReactNode;
  howTo: ReactNode[];
  outcome: ReactNode;
};

export type PageInfo = {
  id: string;
  path: string;
  title: string;
  description: string;
  help: PageHelp;
};

export const PAGE_INFOS: PageInfo[] = [
  {
    id: 'dashboard',
    path: '/',
    title: 'Dashboard',
    description: 'Choose a workflow to get started.',
    help: {
      purpose: (
        <>
          This page is your main starting point. It gives you one clear place
          to choose the next teaching task, whether you are preparing materials
          before class or guiding activities live.
        </>
      ),
      howTo: [
        <>
          <strong>Pick the goal first:</strong> Scan the cards and choose the
          workflow that matches what you need right now.
        </>,
        <>
          <strong>Start with your roster:</strong> If this is your first setup,
          open Student Management and confirm your student list is ready.
        </>,
        <>
          <strong>Move by activity:</strong> Use Generator for fair calling,
          Breakout Rooms for groups, Quizzes for authoring, Quiz Play for live
          delivery, and Projects for saved team lists.
        </>,
        <>
          <strong>Return here anytime:</strong> Come back to switch workflows
          quickly as your lesson changes.
        </>,
      ],
      outcome: (
        <>
          You can move through your full class workflow smoothly without
          guessing where each tool lives.
        </>
      ),
    },
  },
  {
    id: 'students',
    path: '/students',
    title: 'Student Management',
    description: 'Add students, mark absences, and manage your roster.',
    help: {
      purpose: (
        <>
          This is your roster home. Every other feature depends on this list,
          so keeping names accurate here keeps the rest of the app accurate too.
        </>
      ),
      howTo: [
        <>
          <strong>Add students quickly:</strong> Type names manually or import
          multiple names from a comma-separated text file.
        </>,
        <>
          <strong>Clean up names:</strong> Edit spelling or format so names are
          consistent and easy to recognize.
        </>,
        <>
          <strong>Track availability:</strong> Mark students absent when needed
          so selection and grouping tools reflect who is available.
        </>,
        <>
          <strong>Keep it current:</strong> Remove outdated names so this page
          stays your single source of truth.
        </>,
      ],
      outcome: (
        <>
          You get a clean, up-to-date roster that powers Generator, Breakout
          Rooms, Quizzes, and Projects.
        </>
      ),
    },
  },
  {
    id: 'generator',
    path: '/generator',
    title: 'Student Generator',
    description: 'Pick a random student without repeats.',
    help: {
      purpose: (
        <>
          Use this page for fair random calling. It helps you involve everyone
          and avoids immediate repeats.
        </>
      ),
      howTo: [
        <>
          <strong>Open when class starts:</strong> Use the generator whenever
          you are ready to call on students.
        </>,
        <>
          <strong>Draw one name:</strong> Each draw picks one student from the
          current available pool.
        </>,
        <>
          <strong>Continue through the lesson:</strong> Keep drawing as class
          progresses to balance participation.
        </>,
        <>
          <strong>Reset when needed:</strong> Start a fresh cycle whenever you
          want all students back in the selection pool.
        </>,
      ],
      outcome: (
        <>
          You can call on students fairly and keep participation balanced across
          the room.
        </>
      ),
    },
  },
  {
    id: 'breakout-rooms',
    path: '/breakout-rooms',
    title: 'Breakout Rooms',
    description: 'Create randomized student groups for breakout sessions.',
    help: {
      purpose: (
        <>
          This page helps you create groups quickly for partner work, stations,
          and team activities without manual sorting.
        </>
      ),
      howTo: [
        <>
          <strong>Choose your grouping approach:</strong> Pick the setup that
          fits your activity plan.
        </>,
        <>
          <strong>Generate first draft groups:</strong> Create groups from your
          current roster and review the result.
        </>,
        <>
          <strong>Adjust by reshuffling:</strong> Regenerate groups if you want
          a different class mix.
        </>,
        <>
          <strong>Run the activity:</strong> Use the final grouping in class and
          regenerate later when you need a new setup.
        </>,
      ],
      outcome: (
        <>
          You save setup time and get practical, ready-to-use student groups in
          seconds.
        </>
      ),
    },
  },
  {
    id: 'quizzes',
    path: '/quizzes',
    title: 'Quiz Builder',
    description: 'Create and update quizzes with custom questions.',
    help: {
      purpose: (
        <>
          Use this page to prepare quiz content before class so live delivery is
          smooth and focused.
        </>
      ),
      howTo: [
        <>
          <strong>Create a quiz set:</strong> Add clear questions and the
          answers you expect students to give.
        </>,
        <>
          <strong>Review quality:</strong> Check wording, order, and difficulty
          before using the quiz with students.
        </>,
        <>
          <strong>Refine over time:</strong> Update questions as class needs and
          lesson goals evolve.
        </>,
        <>
          <strong>Switch to live mode:</strong> Open Quiz Play when your quiz is
          ready to run in class.
        </>,
      ],
      outcome: (
        <>
          You have organized quiz sets ready to deliver without last-minute
          editing.
        </>
      ),
    },
  },
  {
    id: 'play',
    path: '/play',
    title: 'Quiz Play',
    description: 'Draw a student and a question, then reveal the answer.',
    help: {
      purpose: (
        <>
          This is the live classroom view for running quizzes with clear pacing
          and fair participation.
        </>
      ),
      howTo: [
        <>
          <strong>Start a round:</strong> Draw one student and one question from
          your prepared quiz set.
        </>,
        <>
          <strong>Pause for response:</strong> Give the student time to answer
          before revealing the correct result.
        </>,
        <>
          <strong>Reveal and continue:</strong> Show the answer, then move to
          the next round to keep class momentum.
        </>,
        <>
          <strong>Use repeatedly:</strong> Run this flow for quick checks or
          full quiz sessions.
        </>,
      ],
      outcome: (
        <>
          You can run interactive quiz rounds with less friction and better
          classroom rhythm.
        </>
      ),
    },
  },
  {
    id: 'projects',
    path: '/projects',
    title: 'Project Lists',
    description: 'Build project lists and group students from your roster.',
    help: {
      purpose: (
        <>
          Use this page to build and save project team lists you can return to
          across multiple lessons.
        </>
      ),
      howTo: [
        <>
          <strong>Select who belongs:</strong> Choose the students for a
          specific project list.
        </>,
        <>
          <strong>Shape team structure:</strong> Group students in a way that
          supports your assignment goals.
        </>,
        <>
          <strong>Save for later:</strong> Keep the list so you can reuse or
          adjust it in future sessions.
        </>,
        <>
          <strong>Manage multiple lists:</strong> Maintain different team setups
          for different classes or units.
        </>,
      ],
      outcome: (
        <>
          You keep project group planning organized, reusable, and easy to
          maintain.
        </>
      ),
    },
  },
];

export const PAGE_INFO_BY_PATH = PAGE_INFOS.reduce<Record<string, PageInfo>>(
  (accumulator, page) => {
    accumulator[page.path] = page;
    return accumulator;
  },
  {},
);
