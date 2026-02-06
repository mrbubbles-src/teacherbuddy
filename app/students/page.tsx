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
  },
  twitter: {
    title: 'Student Management | TeacherBuddy',
    description: 'Add students, mark absences, and manage your roster.',
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
