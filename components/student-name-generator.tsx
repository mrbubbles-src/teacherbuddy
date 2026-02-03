"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useStudentGenerator } from "@/hooks/use-student-generator";

type AddStudentCardProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

type GeneratorCardProps = {
  currentName: string | null;
  statusContent: ReactNode;
  canGenerate: boolean;
  canReset: boolean;
  onGenerate: () => void;
  onReset: () => void;
};

type StudentListCardProps = {
  students: string[];
  generatedSet: Set<string>;
};

function capitalizeName(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function GeneratorHeader() {
  return (
    <header className="flex flex-col gap-2">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Teacherbuddy
      </p>
      <h1 className="text-2xl font-semibold sm:text-3xl">
        <span className="text-primary">Random-</span>Student-Name
        <span className="text-primary">-Generator</span>
      </h1>
      <p className="text-sm text-muted-foreground">
        Keep student names in local storage, then generate a random pick until
        everyone has been called.
      </p>
    </header>
  );
}

function AddStudentCard({ value, onChange, onSubmit }: AddStudentCardProps) {
  return (
    <section id="add-students" className="scroll-mt-24">
      <Card>
        <CardHeader>
          <CardTitle>Add Students</CardTitle>
          <CardDescription>
            Enter each name once to store it in your browser.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={onSubmit}
            className="flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Input
              value={value}
              onChange={(event) => onChange(event.target.value)}
              placeholder="Input a student's name"
              aria-label="Student name"
            />
            <Button type="submit" className="sm:w-40">
              Submit Student
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}

function GeneratorCard({
  currentName,
  statusContent,
  canGenerate,
  canReset,
  onGenerate,
  onReset,
}: GeneratorCardProps) {
  return (
    <section id="generator" className="scroll-mt-24">
      <Card>
        <CardHeader>
          <CardTitle>Generator</CardTitle>
          <CardDescription>{statusContent}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="rounded-lg border border-dashed border-border/60 bg-background/60 px-4 py-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Selected Student
            </p>
            <p className="mt-3 text-2xl font-semibold sm:text-3xl">
              {currentName ? capitalizeName(currentName) : "—"}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button onClick={onGenerate} disabled={!canGenerate} className="sm:flex-1">
              Generate!
            </Button>
            <Button
              variant="secondary"
              onClick={onReset}
              disabled={!canReset}
              className="sm:flex-1"
            >
              Reset Generator
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function StudentListCard({ students, generatedSet }: StudentListCardProps) {
  return (
    <section id="student-list" className="scroll-mt-24">
      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
          <CardDescription>
            Generated names are crossed out so you can keep track.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {students.length ? (
            <ul className="grid gap-2 sm:grid-cols-2">
              {students.map((name) => {
                const isGenerated = generatedSet.has(name);
                return (
                  <li
                    key={name}
                    className={cn(
                      "rounded-md border border-border/60 px-3 py-2 text-xs/relaxed",
                      isGenerated
                        ? "border-primary/50 text-primary line-through"
                        : "bg-background/70"
                    )}
                  >
                    {capitalizeName(name)}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              Your student list will appear here once you add names.
            </p>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

function GeneratorFooter() {
  const currentYear = new Date().getFullYear();
  return (
    <footer id="about" className="scroll-mt-24 text-xs text-muted-foreground">
      <p>
        © {currentYear}{" "}
        <a
          className="font-medium text-primary hover:text-primary/70"
          href="https://mrbubbles-src.dev"
          target="_blank"
          rel="noreferrer"
        >
          mrbubbles-src
        </a>
      </p>
    </footer>
  );
}

function getStatusContent(studentsCount: number, remainingCount: number) {
  if (!studentsCount) {
    return (
      <span>
        Please{" "}
        <span className="text-primary">enter the names of your students</span>{" "}
        to generate a random pick.
      </span>
    );
  }

  if (remainingCount === 0) {
    return (
      <span>
        No more names! Press{" "}
        <span className="text-primary">Reset Generator</span> to start
        generating again.
      </span>
    );
  }

  return (
    <span>
      Press <span className="text-primary">Generate!</span> to pick a random
      student.
    </span>
  );
}

export default function StudentNameGenerator() {
  const [studentName, setStudentName] = useState("");
  const {
    students,
    generatedSet,
    remaining,
    sortedStudents,
    currentName,
    addStudent,
    generateStudent,
    resetGenerator,
  } = useStudentGenerator();

  const statusContent = useMemo(
    () => getStatusContent(students.length, remaining.length),
    [students.length, remaining.length]
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!addStudent(studentName)) return;
    setStudentName("");
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-10 sm:px-6">
      <GeneratorHeader />
      <AddStudentCard
        value={studentName}
        onChange={setStudentName}
        onSubmit={handleSubmit}
      />
      <GeneratorCard
        currentName={currentName}
        statusContent={statusContent}
        canGenerate={remaining.length > 0}
        canReset={students.length > 0}
        onGenerate={generateStudent}
        onReset={resetGenerator}
      />
      <StudentListCard students={sortedStudents} generatedSet={generatedSet} />
      <GeneratorFooter />
    </div>
  );
}
