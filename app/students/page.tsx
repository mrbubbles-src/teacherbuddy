import StudentFormSkeleton from '@/components/loading/student-form-skeleton';
import StudentTableSkeleton from '@/components/loading/student-table-skeleton';
import StudentForm from '@/components/students/student-form';
import StudentTable from '@/components/students/student-table';

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <StudentForm skeleton={<StudentFormSkeleton />} />
      <StudentTable skeleton={<StudentTableSkeleton />} />
    </div>
  );
}
