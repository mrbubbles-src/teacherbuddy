/**
 * Route-specific metadata used by both UI page headers and SEO metadata.
 */
export type RoutePageMeta = {
  id: string;
  path: RoutePath;
  title: string;
  description: string;
};

/**
 * Supported top-level application route paths.
 */
export const ROUTE_PATHS = [
  '/',
  '/students',
  '/generator',
  '/breakout-rooms',
  '/quizzes',
  '/play',
  '/projects',
] as const;

export type RoutePath = (typeof ROUTE_PATHS)[number];

/**
 * Source-of-truth route metadata for TeacherBuddy pages.
 */
export const ROUTE_PAGE_META: RoutePageMeta[] = [
  {
    id: 'dashboard',
    path: '/',
    title: 'Dashboard',
    description: 'Choose a workflow to get started.',
  },
  {
    id: 'students',
    path: '/students',
    title: 'Student Management',
    description: 'Add students, mark absences, and manage your roster.',
  },
  {
    id: 'generator',
    path: '/generator',
    title: 'Student Generator',
    description: 'Pick a random student without repeats.',
  },
  {
    id: 'breakout-rooms',
    path: '/breakout-rooms',
    title: 'Breakout Rooms',
    description: 'Create randomized student groups for breakout sessions.',
  },
  {
    id: 'quizzes',
    path: '/quizzes',
    title: 'Quiz Builder',
    description: 'Create and update quizzes with custom questions.',
  },
  {
    id: 'play',
    path: '/play',
    title: 'Quiz Play',
    description: 'Draw a student and a question, then reveal the answer.',
  },
  {
    id: 'projects',
    path: '/projects',
    title: 'Project Lists',
    description: 'Build project lists and group students from your roster.',
  },
];

/**
 * Route metadata indexed by path for quick lookups.
 */
export const ROUTE_PAGE_META_BY_PATH = ROUTE_PAGE_META.reduce(
  (accumulator, page) => {
    accumulator[page.path] = page;
    return accumulator;
  },
  {} as Record<RoutePath, RoutePageMeta>,
);
