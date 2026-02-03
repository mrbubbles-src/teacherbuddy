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

const EMPTY_MESSAGE =
  "Please enter the names of your students to generate a random pick.";
const READY_MESSAGE = "Press Generate to pick a random student.";
const DONE_MESSAGE =
  "No more names! Press Reset Generator to start again.";

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

function loadNamesFromStorage() {
  if (typeof window === "undefined") return [] as string[];

  const names: string[] = [];
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (!key) continue;
    const value = localStorage.getItem(key);
    if (value) names.push(value);
  }

  return names;
}

export default function StudentNameGenerator() {
  const [studentName, setStudentName] = useState("");
  const [students, setStudents] = useState<string[]>([]);
  const [generatedNames, setGeneratedNames] = useState<Set<string>>(
    () => new Set()
  );
  const [currentName, setCurrentName] = useState<string | null>(null);

  useEffect(() => {
    const storedNames = loadNamesFromStorage();
    setStudents(storedNames);
  }, []);

  const remaining = useMemo(
    () => students.filter((name) => !generatedNames.has(name)),
    [students, generatedNames]
  );

  const sortedStudents = useMemo(
    () => [...students].sort((a, b) => a.localeCompare(b)),
    [students]
  );

  const statusMessage = !students.length
    ? EMPTY_MESSAGE
    : remaining.length === 0
      ? DONE_MESSAGE
      : READY_MESSAGE;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = normalizeName(studentName);
    if (!normalized) return;

    localStorage.setItem(normalized, normalized);
    setStudentName("");

    const storedNames = loadNamesFromStorage();
    setStudents(storedNames);
    setGeneratedNames(
      (prev) => new Set([...prev].filter((name) => storedNames.includes(name)))
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
  };

  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Teacherbuddy</CardTitle>
          <CardDescription>
            Store student names locally and draw random picks.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-3 sm:flex-row sm:items-center"
            onSubmit={handleSubmit}
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
          <CardTitle className="text-2xl sm:text-3xl">
            <span className="text-ctp-peach">Random-</span>Student-Name
            <span className="text-ctp-peach">-Generator</span>
          </CardTitle>
          <CardDescription>{statusMessage}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="rounded-2xl border border-dashed border-border/60 bg-surface/40 p-6 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Selected Student
            </p>
            <p className="mt-4 text-3xl font-semibold text-ctp-rosewater sm:text-4xl">
              {currentName ? capitalizeName(currentName) : "—"}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
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
            Generated names are crossed out for quick tracking.
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
                      "rounded-lg border border-border/50 px-3 py-2 text-sm",
                      isGenerated
                        ? "border-ctp-peach/60 text-ctp-sapphire line-through"
                        : "bg-surface/30"
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

      <footer className="text-sm text-muted-foreground">
        <p>
          Created by student{" "}
          <a
            className="text-ctp-blue hover:text-ctp-lavender"
            href="https://github.com/mrbubbles-src"
            target="_blank"
            rel="noreferrer"
          >
            Manuel Fahrenholz
          </a>{" "}
          in class "FBW WD D07 A" of the{" "}
          <a
            className="text-ctp-blue hover:text-ctp-lavender"
            href="https://digitalcareerinstitute.org/"
            target="_blank"
            rel="noreferrer"
          >
            Digital Career Institute
          </a>
          . Check out the documentation{" "}
          <a
            className="text-ctp-blue hover:text-ctp-lavender"
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
