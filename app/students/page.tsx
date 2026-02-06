import { Metadata } from 'next';

import StudentFormSkeleton from '@/components/loading/student-form-skeleton';
import StudentTableSkeleton from '@/components/loading/student-table-skeleton';
import StudentForm from '@/components/students/student-form';
import StudentTable from '@/components/students/student-table';

export const metadata: Metadata = {
  title: 'Student Management | TeacherBuddy',
  description: 'Add students, mark absences, and manage your roster.',
  openGraph: {
    title: 'Student Management | TeacherBuddy',
    description: 'Add students, mark absences, and manage your roster.',
    siteName: 'TeacherBuddy',
    images: [
      {
        url: 'https://teacherbuddy.mrbubbles-src.dev/api/og',
        width: 1200,
        height: 630,
        alt: 'TeacherBuddy Logo',
      },
    ],
    type: 'website',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Student Management | TeacherBuddy',
    description: 'Add students, mark absences, and manage your roster.',
    images: ['https://teacherbuddy.mrbubbles-src.dev/api/og'],
    creator: '@_MstrBubbles',
  },
};

/**
 * Renders the student management route with roster form and table.
 * Use this page to add, import, edit, and review student availability.
 */
export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <StudentForm skeleton={<StudentFormSkeleton />} />
      <StudentTable skeleton={<StudentTableSkeleton />} />
    </div>
  );
}
