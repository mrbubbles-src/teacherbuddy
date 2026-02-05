"use client";

import * as React from "react";

type StudentGeneratorState = {
  students: string[];
  generated: string[];
  currentName: string | null;
};

const STORAGE_KEY = "teacherbuddy:student-generator";
const LEGACY_STORAGE_KEY = "teacherbuddy:students";

const EMPTY_STATE: StudentGeneratorState = {
  students: [],
  generated: [],
  currentName: null,
};

function normalizeName(name: string) {
  return name.replace(/\s+/g, " ").trim();
}

function uniqueList(values: string[]) {
  return Array.from(new Set(values));
}

function sanitizeList(value: unknown) {
  if (!Array.isArray(value)) return [];
  return uniqueList(
    value
      .filter((entry): entry is string => typeof entry === "string")
      .map(normalizeName)
      .filter(Boolean)
  );
}

function sanitizeState(state: StudentGeneratorState): StudentGeneratorState {
  const students = sanitizeList(state.students);
  const generated = sanitizeList(state.generated).filter((name) =>
    students.includes(name)
  );
  const currentName =
    state.currentName && students.includes(state.currentName)
      ? state.currentName
      : null;

  return {
    students,
    generated,
    currentName,
  };
}

function loadStateFromStorage(): StudentGeneratorState {
  if (typeof window === "undefined") return EMPTY_STATE;

  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as Partial<StudentGeneratorState>;
      if (parsed && typeof parsed === "object") {
        return sanitizeState({
          students: parsed.students ?? [],
          generated: parsed.generated ?? [],
          currentName: parsed.currentName ?? null,
        });
      }
    } catch (error) {
      console.error("Failed to parse stored student generator data", error);
    }
  }

  const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
  if (!legacyRaw) return EMPTY_STATE;

  try {
    const parsed = JSON.parse(legacyRaw);
    const students = sanitizeList(parsed);
    return {
      students,
      generated: [],
      currentName: null,
    };
  } catch (error) {
    console.error("Failed to parse stored students", error);
  }

  return EMPTY_STATE;
}

function saveStateToStorage(state: StudentGeneratorState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  localStorage.removeItem(LEGACY_STORAGE_KEY);
}

/**
 * Manages persisted random-student generator state and actions.
 * Returns normalized student lists, remaining candidates, and mutation helpers.
 */
export function useStudentGenerator() {
  const [state, setState] = React.useState<StudentGeneratorState>(EMPTY_STATE);
  const [hasHydrated, setHasHydrated] = React.useState(false);

  React.useEffect(() => {
    setState(loadStateFromStorage());
    setHasHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hasHydrated) return;
    saveStateToStorage(state);
  }, [state, hasHydrated]);

  const students = state.students;
  const generated = state.generated;
  const currentName = state.currentName;

  const generatedSet = React.useMemo(
    () => new Set(generated),
    [generated]
  );

  const remaining = React.useMemo(
    () => students.filter((name) => !generatedSet.has(name)),
    [students, generatedSet]
  );

  const sortedStudents = React.useMemo(
    () => [...students].sort((a, b) => a.localeCompare(b)),
    [students]
  );

  const addStudent = React.useCallback((name: string) => {
    const normalized = normalizeName(name);
    if (!normalized) return false;

    setState((prev) => {
      const students = uniqueList([...prev.students, normalized]);
      return sanitizeState({
        students,
        generated: prev.generated,
        currentName: prev.currentName,
      });
    });

    return true;
  }, []);

  const generateStudent = React.useCallback(() => {
    setState((prev) => {
      const generatedSet = new Set(prev.generated);
      const remaining = prev.students.filter(
        (name) => !generatedSet.has(name)
      );
      if (!remaining.length) return prev;

      const nextName =
        remaining[Math.floor(Math.random() * remaining.length)];

      return sanitizeState({
        students: prev.students,
        generated: [...prev.generated, nextName],
        currentName: nextName,
      });
    });
  }, []);

  const resetGenerator = React.useCallback(() => {
    setState((prev) => ({
      ...prev,
      generated: [],
      currentName: null,
    }));
  }, []);

  return {
    students,
    generated,
    generatedSet,
    currentName,
    remaining,
    sortedStudents,
    addStudent,
    generateStudent,
    resetGenerator,
  };
}
