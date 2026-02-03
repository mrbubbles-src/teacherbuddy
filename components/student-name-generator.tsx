"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";

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

function normalizeName(name: string) {
  return name.replace(/\s+/g, " ").trim();
}

function capitalizeName(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

const STORAGE_KEY = "teacherbuddy:students";

function loadNamesFromStorage() {
  if (typeof window === "undefined") return [] as string[];

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((entry): entry is string => typeof entry === "string");
    }
  } catch (error) {
    console.error("Failed to parse stored students", error);
  }

  return [];
}

function saveNamesToStorage(names: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(names));
}

export default function StudentNameGenerator() {
  const [studentName, setStudentName] = useState("");
  const [students, setStudents] = useState<string[]>([]);
  const [generatedNames, setGeneratedNames] = useState<Set<string>>(
    () => new Set()
  );
  const [currentName, setCurrentName] = useState<string | null>(null);

  const syncFromStorage = () => {
    const storedNames = loadNamesFromStorage();
    setStudents(storedNames);
    setGeneratedNames(
      (prev) => new Set([...prev].filter((name) => storedNames.includes(name)))
    );
    setCurrentName((prev) =>
      prev && storedNames.includes(prev) ? prev : null
    );
  };

  useEffect(() => {
    syncFromStorage();
  }, []);

  const remaining = useMemo(
    () => students.filter((name) => !generatedNames.has(name)),
    [students, generatedNames]
  );

  const sortedStudents = useMemo(
    () => [...students].sort((a, b) => a.localeCompare(b)),
    [students]
  );

  const statusContent = !students.length ? (
    <span>
      Please <span className="text-primary">enter the names of your students</span>{" "}
      to generate a random pick.
    </span>
  ) : remaining.length === 0 ? (
    <span>
      No more names! Press <span className="text-primary">Reset Generator</span>{" "}
      to start generating again.
    </span>
  ) : (
    <span>
      Press <span className="text-primary">Generate!</span> to pick a random
      student.
    </span>
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = normalizeName(studentName);
    if (!normalized) return;

    const nextNames = Array.from(new Set([...students, normalized]));
    saveNamesToStorage(nextNames);
    setStudentName("");
    setStudents(nextNames);
    setGeneratedNames((prev) =>
      new Set([...prev].filter((name) => nextNames.includes(name)))
    );
  };

  const handleGenerate = () => {
    if (!remaining.length) return;

    const nextIndex = Math.floor(Math.random() * remaining.length);
    const nextName = remaining[nextIndex];

    setCurrentName(nextName);
    setGeneratedNames((prev) => {
      const updated = new Set(prev);
      updated.add(nextName);
      return updated;
    });
  };

  const handleReset = () => {
    setGeneratedNames(new Set());
    setCurrentName(null);
    syncFromStorage();
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-10 sm:px-6">
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

      <Card>
        <CardHeader>
          <CardTitle>Add Students</CardTitle>
          <CardDescription>
            Enter each name once to store it in your browser.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Input
              value={studentName}
              onChange={(event) => setStudentName(event.target.value)}
              placeholder="Input a student's name"
              aria-label="Student name"
            />
            <Button type="submit" className="sm:w-40">
              Submit Student
            </Button>
          </form>
        </CardContent>
      </Card>

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
            <Button
              onClick={handleGenerate}
              disabled={!remaining.length}
              className="sm:flex-1"
            >
              Generate!
            </Button>
            <Button
              variant="secondary"
              onClick={handleReset}
              disabled={!students.length}
              className="sm:flex-1"
            >
              Reset Generator
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
          <CardDescription>
            Generated names are crossed out so you can keep track.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sortedStudents.length ? (
            <ul className="grid gap-2 sm:grid-cols-2">
              {sortedStudents.map((name) => {
                const isGenerated = generatedNames.has(name);
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

      <footer className="text-xs text-muted-foreground">
        <p>
          Created by student{" "}
          <a
            className="font-medium text-primary hover:text-primary/70"
            href="https://github.com/mrbubbles-src"
            target="_blank"
            rel="noreferrer"
          >
            Manuel Fahrenholz
          </a>{" "}
          in class "FBW WD D07 A" of the{" "}
          <a
            className="font-medium text-primary hover:text-primary/70"
            href="https://digitalcareerinstitute.org/"
            target="_blank"
            rel="noreferrer"
          >
            Digital Career Institute
          </a>
          . Check out the documentation{" "}
          <a
            className="font-medium text-primary hover:text-primary/70"
            href="https://github.com/mrbubbles-src/random-student-name-generator"
            target="_blank"
            rel="noreferrer"
          >
            here
          </a>
          .
        </p>
      </footer>
    </div>
  );
}
