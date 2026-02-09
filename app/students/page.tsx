import { Metadata } from 'next';

import StudentFormSkeleton from '@/components/loading/student-form-skeleton';
import StudentTableSkeleton from '@/components/loading/student-table-skeleton';
import StudentForm from '@/components/students/student-form';
import StudentTable from '@/components/students/student-table';

export const metadata: Metadata = {
  title: 'Student Management',
  description:
    'Add students, mark absences, and keep your class roster organised — all from one simple dashboard.',
};

/**
 * Renders the student management route with roster form and table.
 * Use this page to add, import, edit, and review student availability.
 */
export default function Page() {
  return (
    <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:items-start">
      <StudentForm skeleton={<StudentFormSkeleton />} />
      <StudentTable skeleton={<StudentTableSkeleton />} />
    </div>
  );
}
