import StudentNameGenerator from "@/components/student-name-generator";

export default function HomePage() {
  return (
    <main className="relative min-h-screen">
      <div className="relative mx-auto flex max-w-5xl flex-col gap-8 px-6 py-12">
        <StudentNameGenerator />
      </div>
    </main>
  );
}
