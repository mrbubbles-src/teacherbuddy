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
          This is where your classes and rosters live. Create classes, import
          full class files, add students, and mark who is absent today. Every
          other tool uses the class you pick here.
        </>
      ),
      howTo: [
        <>
          <strong>Choose your setup style</strong>: add class names manually, or
          import a full class file that includes both class name and students.
        </>,
        <>
          <strong>Importing full classes?</strong> Use `.txt` lines like
          `Class Name: Student A, Student B` or a `.json` class object. If the
          class name already exists, that class roster is replaced with the
          imported students.
        </>,
        <>
          <strong>Use the class dropdown</strong> to switch between rosters.
          Student imports from `.txt` add names only to the class you currently
          selected.
        </>,
        <>
          <strong>Need to clean up?</strong> Edit, delete, mark absent, or
          remove the selected class or all classes from the controls beside the
          class selector.
        </>,
      ],
      outcome: (
        <>
          Clear, class-by-class rosters that keep generator picks, breakout
          groups, quiz play, and project lists accurate.
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
          <strong>Select a class first</strong> so the draw uses the right
          roster for this lesson.
        </>,
        <>
          <strong>Tap &quot;Draw&quot;</strong> to pick a random student. Their name pops
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
          Fair, random participation without the awkward &quot;who has not gone yet?&quot;
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
          <strong>Pick your class</strong> from the dropdown first so groups are
          built from the right roster.
        </>,
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
          Build and organize quiz sets before class so your live review runs
          smoothly. Write questions by hand, add optional quiz notes, and keep
          everything ready to reuse.
        </>
      ),
      howTo: [
        <>
          <strong>Create a new quiz</strong> and give it a clear name (like
          &quot;Ch. 5 Vocab&quot; or &quot;Friday Review&quot;). Add an optional description if you
          want quick context later.
        </>,
        <>
          <strong>Add questions one by one</strong> with a prompt and answer.
          Questions show up in an easy-to-scan card list where you can edit or
          remove them fast.
        </>,
        <>
          <strong>Need to import a bunch?</strong> Upload a JSON file. One quiz
          object loads into your draft (then tap Save Quiz to keep it). An
          array of quiz objects saves multiple quizzes right away.
        </>,
        <>
          <strong>Ready to use it live?</strong> Head over to Quiz Play to run
          it with your class.
        </>,
      ],
      outcome: (
        <>
          Polished quiz sets you can run immediately, reuse next term, and
          update in seconds when your lesson plan changes.
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
          <strong>Select your class first</strong> so quiz draws use the right
          students for that period.
        </>,
        <>
          <strong>Pick a quiz</strong> from the dropdown — these are the ones
          you built in Quiz Builder.
        </>,
        <>
          <strong>Tap &quot;Draw&quot;</strong> to get a random student + question combo.
        </>,
        <>
          <strong>Give them a moment</strong> to think, then tap &quot;Reveal&quot; to
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
          <strong>Pick your class first</strong> so this project list stays tied
          to the right roster.
        </>,
        <>
          <strong>Name your project</strong> and pick a type so you can tell
          your lists apart (like &quot;Science Fair&quot; or &quot;Book Club Groups&quot;).
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
