'use client';

import { normalizeStudentName, studentNameKey } from '@/lib/students';

import { useState } from 'react';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/context/app-store';

/** Event type for form submit; avoids deprecated React.FormEvent. */
type FormSubmitEvent = Parameters<
  NonNullable<React.ComponentProps<'form'>['onSubmit']>
>[0];
/** Event type for input change; avoids deprecated React.ChangeEvent. */
type InputChangeEvent = Parameters<
  NonNullable<React.ComponentProps<'input'>['onChange']>
>[0];

/**
 * Add/import students form. Shows server-rendered skeleton until hydrated.
 * Skeleton is passed from the page (RSC) so it runs as a server component.
 */
export default function StudentForm({
  skeleton,
}: {
  skeleton: React.ReactNode;
}) {
  const { state, actions } = useAppStore();
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [importNotice, setImportNotice] = useState<string | null>(null);

  /**
   * Parses a raw comma-separated list, adds unique students, and returns a count.
   * Uses persisted students to de-dupe against existing roster entries.
   *
   * @param raw - Comma-separated student names to add.
   * @returns The number of new students added to state.
   */
  const addNames = (raw: string) => {
    const existingKeys = new Set(
      state.persisted.students.map((student) => studentNameKey(student.name)),
    );
    const names = raw
      .split(',')
      .map((entry) => normalizeStudentName(entry))
      .filter(Boolean);

    const uniqueNames: string[] = [];
    for (const entry of names) {
      const key = studentNameKey(entry);
      if (existingKeys.has(key)) continue;
      existingKeys.add(key);
      uniqueNames.push(entry);
    }

    if (!uniqueNames.length) {
      return 0;
    }

    for (const entry of uniqueNames) {
      actions.addStudent(entry);
    }

    return uniqueNames.length;
  };

  /**
   * Handles manual student entry submission and triggers a toast on success.
   *
   * @param event - Form submit event from the student name form.
   */
  const handleSubmit = (event: FormSubmitEvent) => {
    event.preventDefault();
    const addedCount = addNames(name);
    if (!addedCount) {
      toast.error('Enter at least one new student name.');
      setError('Enter at least one new student name.');
      return;
    }
    setName('');
    setError(null);
    setImportNotice(null);
    toast.success(`Added ${addedCount} student${addedCount === 1 ? '' : 's'}.`);
  };

  /**
   * Reads a .txt upload, imports students, and confirms the result with a toast.
   *
   * @param event - File input change event containing the uploaded file.
   * @returns A promise that resolves after the file is processed.
   */
  const handleFileImport = async (event: InputChangeEvent) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const addedCount = addNames(text);
      if (!addedCount) {
        toast.error('No new students were found in that file.');
        setImportError('No new students were found in that file.');
        setImportNotice(null);
      } else {
        setImportError(null);
        setImportNotice(
          `Imported ${addedCount} student${addedCount === 1 ? '' : 's'}.`,
        );
        toast.success(
          `Imported ${addedCount} student${addedCount === 1 ? '' : 's'}.`,
        );
      }
    } catch (error) {
      console.error('Failed to import students', error);
      const message = 'Could not read the file. Please try again.';
      setImportError(message);
      setImportNotice(null);
      toast.error(message);
    } finally {
      event.target.value = '';
    }
  };

  if (!state.ui.isHydrated) {
    return <>{skeleton}</>;
  }

  return (
    <Card className="relative overflow-hidden rounded-xl border-border/50 shadow-md py-6 xl:py-8 lg:gap-6 xl:gap-8">
      <div
        className="absolute left-0 top-0 h-full w-1 rounded-l-xl"
        style={{ backgroundColor: 'var(--chart-1)', opacity: 0.6 }}
      />
      <CardHeader className="px-6 xl:px-8">
        <CardTitle className="text-xl font-bold tracking-tight">Add Students</CardTitle>
        <CardDescription className="text-base/relaxed">
          Add students manually or paste a comma-separated list. You can also
          import a comma-separated .txt file below.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 xl:px-8 gap-5 xl:gap-6 text-base/relaxed flex flex-col">
        <form onSubmit={handleSubmit} className="">
          <Field className="flex-1">
            <FieldLabel htmlFor="student-name" className="text-lg/relaxed">
              Student name
            </FieldLabel>
            <FieldContent className="gap-2">
              <div className="flex flex-col md:flex-row gap-4">
                <Input
                  id="student-name"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="e.g. Alex Johnson, Sam Lee, Priya Patel"
                  aria-label="Student name"
                  className="text-base/relaxed h-9 placeholder:text-muted-foreground/70 placeholder:text-base/relaxed"
                />
                <Button
                  type="submit"
                  className="h-9 font-semibold active:font-normal  text-base">
                  Add Student
                </Button>
              </div>
              <FieldDescription className="text-base/relaxed text-muted-foreground/70">
                Separate multiple names with commas. Names are case-insensitive.
              </FieldDescription>
              {error ? <FieldError>{error}</FieldError> : null}
            </FieldContent>
          </Field>
        </form>
        <FieldSeparator>Import</FieldSeparator>
        <Field>
          <FieldLabel htmlFor="student-import" className="text-lg/relaxed">
            Import from .txt
          </FieldLabel>
          <FieldContent className="gap-2">
            <Input
              id="student-import"
              type="file"
              accept=".txt,text/plain"
              onChange={handleFileImport}
              className="text-base/relaxed h-10 max-w-full file:text-base/relaxed file:text-muted-foreground/70 file:mr-5 file:px-5 file:bg-accent/10 file:border-accent/50 file:rounded-md file:cursor-pointer file:my-1"
            />
            <FieldDescription className="text-base/relaxed text-muted-foreground/70">
              Upload a .txt file with comma-separated names.
            </FieldDescription>
            {importError ? <FieldError>{importError}</FieldError> : null}
            {importNotice ? (
              <p className="text-base/relaxed text-muted-foreground">
                {importNotice}
              </p>
            ) : null}
          </FieldContent>
        </Field>
      </CardContent>
    </Card>
  );
}
