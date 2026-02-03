import StudentForm from "@/components/students/student-form"
import StudentTable from "@/components/students/student-table"

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <StudentForm />
      <StudentTable />
    </div>
  )
}
