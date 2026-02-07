import type { RoutePageMeta, RoutePath } from '@/lib/page-meta';
import type { ReactNode } from 'react';

import { ROUTE_PAGE_META_BY_PATH, ROUTE_PATHS } from '@/lib/page-meta';

type PageHelp = {
  purpose: ReactNode;
  howTo: ReactNode[];
  outcome: ReactNode;
};

export type PageInfo = RoutePageMeta & {
  help: PageHelp;
};

/**
 * Route help content used by the info panel and header guidance UI.
 * Written in a warm, practical tone for classroom teachers.
 */
export const PAGE_INFOS: PageInfo[] = [
  {
    ...ROUTE_PAGE_META_BY_PATH['/'],
    help: {
      purpose: (
        <>
          Your home base. Everything starts here — pick a tool, jump into a
          lesson, or check on what you set up earlier. Think of it as your
          teaching control room.
        </>
      ),
      howTo: [
        <>
          <strong>Glance at the cards</strong> to find what you need — each one
          is a different classroom tool.
        </>,
        <>
          <strong>New here?</strong> Head to Students first and get your class
          roster in. Everything else builds on that.
        </>,
        <>
          <strong>Tap any card</strong> to jump straight to that tool. Generator
          for calling on students, Breakout Rooms for groups, Quizzes for
          building questions, and so on.
        </>,
        <>
          <strong>Come back anytime</strong> — this page is always just a tap
          away when you need to switch gears mid-lesson.
        </>,
      ],
      outcome: (
        <>
          You always know where to go next, whether you are prepping before
          class or pivoting during one.
        </>
      ),
    },
  },
  {
    ...ROUTE_PAGE_META_BY_PATH['/students'],
    help: {
      purpose: (
        <>
          This is where your class list lives. Add names, mark who is absent
          today, and keep things tidy. Every other tool in the app pulls from
          this list, so it is worth keeping it up to date.
        </>
      ),
      howTo: [
        <>
          <strong>Add students</strong> one at a time by typing a name, or paste
          in a bunch of names at once separated by commas.
        </>,
        <>
          <strong>Fix a name?</strong> Just tap the edit button next to it and
          correct the spelling.
        </>,
        <>
          <strong>Student absent today?</strong> Toggle them to absent so they
          will not show up in the random generator or group maker.
        </>,
        <>
          <strong>Student left the class?</strong> Delete them to keep the
          roster clean.
        </>,
      ],
      outcome: (
        <>
          A clean, current class list that keeps all your other tools accurate
          and ready to go.
        </>
      ),
    },
  },
  {
    ...ROUTE_PAGE_META_BY_PATH['/generator'],
    help: {
      purpose: (
        <>
          Need to call on someone? This tool picks a random student from your
          roster so everyone gets a fair turn — no playing favorites, no
          forgetting who already went.
        </>
      ),
      howTo: [
        <>
          <strong>Tap "Draw"</strong> to pick a random student. Their name pops
          up big and clear.
        </>,
        <>
          <strong>Keep going</strong> — each draw picks someone new so nobody
          gets called twice in a row.
        </>,
        <>
          <strong>Gone through everyone?</strong> Hit reset to start a fresh
          round with all students back in the pool.
        </>,
      ],
      outcome: (
        <>
          Fair, random participation without the awkward "who has not gone yet?"
          moment.
        </>
      ),
    },
  },
  {
    ...ROUTE_PAGE_META_BY_PATH['/breakout-rooms'],
    help: {
      purpose: (
        <>
          Splits your class into groups instantly — great for partner work, lab
          stations, discussion circles, or any activity where you need teams
          fast.
        </>
      ),
      howTo: [
        <>
          <strong>Pick how many groups</strong> or how many students per group —
          whichever is easier for your activity.
        </>,
        <>
          <strong>Tap generate</strong> and the app shuffles your roster into
          random groups.
        </>,
        <>
          <strong>Not happy with the mix?</strong> Just regenerate for a
          different arrangement.
        </>,
        <>
          <strong>Happy with it?</strong> Use those groups for your lesson. Come
          back and regenerate whenever you need new ones.
        </>,
      ],
      outcome: (
        <>
          Ready-to-use student groups in seconds, instead of spending five
          minutes sorting kids into teams.
        </>
      ),
    },
  },
  {
    ...ROUTE_PAGE_META_BY_PATH['/quizzes'],
    help: {
      purpose: (
        <>
          Build your quiz questions here before class so you are not making
          things up on the fly. Add questions, write answers, and organize
          everything at your own pace.
        </>
      ),
      howTo: [
        <>
          <strong>Create a new quiz</strong> and give it a name that helps you
          find it later (like "Ch. 5 Vocab" or "Friday Review").
        </>,
        <>
          <strong>Add questions one by one</strong> — type the question and the
          answer you are looking for.
        </>,
        <>
          <strong>Need to import a bunch?</strong> Paste questions from a
          spreadsheet or document to save time.
        </>,
        <>
          <strong>Ready to use it live?</strong> Head over to Quiz Play to run
          it with your class.
        </>,
      ],
      outcome: (
        <>
          Polished quiz sets you can reuse across classes and semesters —
          no more scrambling for questions.
        </>
      ),
    },
  },
  {
    ...ROUTE_PAGE_META_BY_PATH['/play'],
    help: {
      purpose: (
        <>
          The live quiz screen for your classroom. It picks a random student and
          a question, then lets you reveal the answer when they are ready. Great
          for reviews, warm-ups, or exit tickets.
        </>
      ),
      howTo: [
        <>
          <strong>Pick a quiz</strong> from the dropdown — these are the ones
          you built in Quiz Builder.
        </>,
        <>
          <strong>Tap "Draw"</strong> to get a random student + question combo.
        </>,
        <>
          <strong>Give them a moment</strong> to think, then tap "Reveal" to
          show the answer.
        </>,
        <>
          <strong>Keep drawing</strong> for more rounds. The timer up top helps
          you pace things.
        </>,
      ],
      outcome: (
        <>
          Engaging, fair quiz rounds that keep the whole class on their toes —
          not just the hand-raisers.
        </>
      ),
    },
  },
  {
    ...ROUTE_PAGE_META_BY_PATH['/projects'],
    help: {
      purpose: (
        <>
          Save student lineups for projects that span multiple days. Pick who
          is on each project, optionally group them into teams, and come back
          to the same list next week.
        </>
      ),
      howTo: [
        <>
          <strong>Name your project</strong> and pick a type so you can tell
          your lists apart (like "Science Fair" or "Book Club Groups").
        </>,
        <>
          <strong>Select the students</strong> who belong on this project. You
          can pick from your full roster.
        </>,
        <>
          <strong>Want teams?</strong> Turn on grouping and set the group
          size — the app divides students automatically.
        </>,
        <>
          <strong>Save it</strong> and come back to edit, add students, or
          create a new list whenever you need.
        </>,
      ],
      outcome: (
        <>
          Organized project lists you can pull up anytime — no more sticky notes
          or lost spreadsheets.
        </>
      ),
    },
  },
];

/**
 * Route help content indexed by path for direct lookups.
 */
export const PAGE_INFO_BY_PATH = PAGE_INFOS.reduce<Record<RoutePath, PageInfo>>(
  (accumulator, page) => {
    accumulator[page.path] = page;
    return accumulator;
  },
  {} as Record<RoutePath, PageInfo>,
);

/**
 * Returns page info for a top-level route path, or null when the path is unknown.
 */
export function getPageInfoByPath(pathname: string): PageInfo | null {
  if (!ROUTE_PATHS.includes(pathname as RoutePath)) {
    return null;
  }

  return PAGE_INFO_BY_PATH[pathname as RoutePath];
}
