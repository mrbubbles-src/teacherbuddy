import {
  buildPageMetadata,
  DEFAULT_SITE_DESCRIPTION,
  resolveMetadataBase,
  SHARED_OPEN_GRAPH,
  SHARED_TWITTER,
} from '@/lib/metadata';

import { beforeEach, describe, expect, it } from 'vitest';

const METADATA_ENV_KEYS = [
  'NEXT_PUBLIC_SITE_URL',
  'VERCEL_PROJECT_PRODUCTION_URL',
  'VERCEL_URL',
] as const;

function clearMetadataEnvVariables() {
  for (const key of METADATA_ENV_KEYS) {
    delete process.env[key];
  }
}

describe('resolveMetadataBase', () => {
  beforeEach(() => {
    clearMetadataEnvVariables();
  });

  it('prefers NEXT_PUBLIC_SITE_URL when provided', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://teacherbuddy.dev';
    process.env.VERCEL_PROJECT_PRODUCTION_URL = 'teacherbuddy.vercel.app';

    expect(resolveMetadataBase().toString()).toBe('https://teacherbuddy.dev/');
  });

  it('uses VERCEL_PROJECT_PRODUCTION_URL when NEXT_PUBLIC_SITE_URL is missing', () => {
    process.env.VERCEL_PROJECT_PRODUCTION_URL = 'teacherbuddy.vercel.app';

    expect(resolveMetadataBase().toString()).toBe(
      'https://teacherbuddy.vercel.app/',
    );
  });

  it('falls back to VERCEL_URL when production URL is missing', () => {
    process.env.VERCEL_URL = 'preview-teacherbuddy.vercel.app';

    expect(resolveMetadataBase().toString()).toBe(
      'https://preview-teacherbuddy.vercel.app/',
    );
  });

  it('falls back to localhost when no env URL values exist', () => {
    expect(resolveMetadataBase().toString()).toBe('http://localhost:3000/');
  });
});

describe('buildPageMetadata', () => {
  it('returns full metadata for known routes', () => {
    const metadata = buildPageMetadata('/students');

    expect(metadata.title).toBe('Student Management');
    expect(metadata.description).toBe(
      'Add students, mark absences, and manage your roster.',
    );
    expect(metadata.alternates?.canonical).toBe('/students');
    expect(metadata.openGraph).toMatchObject({
      ...SHARED_OPEN_GRAPH,
      title: 'Student Management',
      description: 'Add students, mark absences, and manage your roster.',
      url: '/students',
    });
    expect(metadata.twitter).toMatchObject({
      ...SHARED_TWITTER,
      title: 'Student Management',
      description: 'Add students, mark absences, and manage your roster.',
    });
  });

  it('returns fallback metadata for unknown routes', () => {
    const metadata = buildPageMetadata('/missing');

    expect(metadata.title).toBe('TeacherBuddy');
    expect(metadata.description).toBe(DEFAULT_SITE_DESCRIPTION);
    expect(metadata.alternates?.canonical).toBe('/missing');
    expect(metadata.openGraph).toMatchObject({
      ...SHARED_OPEN_GRAPH,
      title: 'TeacherBuddy',
      description: DEFAULT_SITE_DESCRIPTION,
      url: '/missing',
    });
    expect(metadata.twitter).toMatchObject({
      ...SHARED_TWITTER,
      title: 'TeacherBuddy',
      description: DEFAULT_SITE_DESCRIPTION,
    });
  });
});
