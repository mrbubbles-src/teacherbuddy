'use client';

import {
  formatStudentName,
  normalizeStudentName,
  studentNameKey,
} from '@/lib/students';
import { cn } from '@/lib/utils';

import { useEffect, useMemo, useState } from 'react';

import { PencilIcon, Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppStore } from '@/context/app-store';

/**
 * Student roster cards for the selected class. Shows server-rendered skeleton until hydrated.
 */
export default function StudentTable({
  skeleton,
}: {
  skeleton: React.ReactNode;
}) {
  const { state, actions } = useAppStore();
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editClassId, setEditClassId] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [linkedCardHeight, setLinkedCardHeight] = useState<number | null>(null);

  const activeClassId = state.persisted.activeClassId;
  const activeClass =
    state.persisted.classes.find((entry) => entry.id === activeClassId) ?? null;

  const students = useMemo(
    () =>
      [...state.persisted.students]
        .filter((student) => student.classId === activeClassId)
        .sort((a, b) => a.name.localeCompare(b.name)),
    [activeClassId, state.persisted.students],
  );

  const activeCount = students.filter(
    (student) => student.status === 'active',
  ).length;

  const editingStudent = editingStudentId
    ? (state.persisted.students.find(
        (student) => student.id === editingStudentId,
      ) ?? null)
    : null;

  /**
   * Keeps the student list card height aligned to the form card on desktop widths.
   * This prevents long rosters from stretching the outer card; the list scrolls instead.
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const desktopQuery = window.matchMedia('(min-width: 1024px)');
    let resizeObserver: ResizeObserver | null = null;

    const syncHeight = () => {
      if (!desktopQuery.matches) {
        setLinkedCardHeight(null);
        return;
      }

      const formCard = document.querySelector<HTMLElement>(
        '[data-students-form-card]',
      );
      if (!formCard) return;
      const nextHeight = Math.round(formCard.getBoundingClientRect().height);
      setLinkedCardHeight((currentHeight) =>
        currentHeight === nextHeight ? currentHeight : nextHeight,
      );
    };

    syncHeight();

    const formCard = document.querySelector<HTMLElement>(
      '[data-students-form-card]',
    );
    if (formCard) {
      resizeObserver = new ResizeObserver(() => syncHeight());
      resizeObserver.observe(formCard);
    }

    const handleViewportChange = () => syncHeight();
    desktopQuery.addEventListener('change', handleViewportChange);
    window.addEventListener('resize', handleViewportChange);

    return () => {
      resizeObserver?.disconnect();
      desktopQuery.removeEventListener('change', handleViewportChange);
      window.removeEventListener('resize', handleViewportChange);
    };
  }, []);

  /**
   * Opens the edit dialog for a student and seeds the form state.
   */
  const handleOpenEdit = (studentId: string) => {
    const student = state.persisted.students.find(
      (item) => item.id === studentId,
    );
    if (!student) return;
    setEditingStudentId(student.id);
    setEditName(student.name);
    setEditClassId(student.classId);
    setEditError(null);
  };

  /**
   * Clears edit state and closes the edit dialog.
   */
  const handleCloseEdit = () => {
    setEditingStudentId(null);
    setEditName('');
    setEditClassId(null);
    setEditError(null);
  };

  /**
   * Validates the edited student fields and persists updates.
   */
  const handleSaveEdit = () => {
    const normalized = normalizeStudentName(editName);
    const targetClassId = editClassId ?? editingStudent?.classId ?? null;

    if (!normalized || !targetClassId) {
      setEditError('Enter a student name and class to continue.');
      return;
    }

    const nextKey = studentNameKey(normalized);
    const hasDuplicate = state.persisted.students.some(
      (student) =>
        student.id !== editingStudentId &&
        student.classId === targetClassId &&
        studentNameKey(student.name) === nextKey,
    );
    if (hasDuplicate) {
      setEditError('That student already exists in this class.');
      return;
    }

    if (editingStudentId) {
      actions.updateStudent(editingStudentId, normalized, targetClassId);
      toast.success('Student updated.');
    }
    handleCloseEdit();
  };

  /**
   * Toggles a student's active/excluded status.
   */
  const handleToggleExcluded = (studentId: string) => {
    const student = state.persisted.students.find(
      (item) => item.id === studentId,
    );
    actions.toggleStudentExcluded(studentId);
    if (student) {
      const nextStatus = student.status === 'active' ? 'excluded' : 'active';
      toast.success(
        `${formatStudentName(student.name)} marked as ${nextStatus}.`,
      );
    }
  };

  /**
   * Deletes a student and shows a confirmation toast.
   */
  const handleDeleteStudent = (studentId: string) => {
    const student = state.persisted.students.find(
      (item) => item.id === studentId,
    );
    actions.deleteStudent(studentId);
    if (student) {
      toast.success(`Removed ${formatStudentName(student.name)}.`);
    }
  };

  /**
   * Clears all students from the selected class.
   */
  const handleClearStudents = () => {
    actions.clearStudents();
    toast.success('Selected class roster deleted.');
  };

  if (!state.ui.isHydrated) {
    return <>{skeleton}</>;
  }

  return (
    <Card
      data-students-list-card
      style={linkedCardHeight ? { height: `${linkedCardHeight}px` } : undefined}
      className="relative overflow-hidden rounded-xl border-border/50 shadow-md py-6 xl:py-8 lg:gap-6 xl:gap-8 lg:min-h-0">
      <div
        className="absolute left-0 top-0 h-full w-1 rounded-l-xl"
        style={{ backgroundColor: 'var(--chart-1)', opacity: 0.6 }}
      />
      <CardHeader className="px-6 xl:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <CardTitle className="text-xl font-bold tracking-tight">
              Student List
            </CardTitle>
            <CardDescription className="text-base/relaxed">
              {!activeClass
                ? 'Select or create a class to view its roster.'
                : students.length
                  ? `${activeClass.name}: ${activeCount} active · ${students.length - activeCount} excluded`
                  : `${activeClass.name}: no students yet.`}
            </CardDescription>
          </div>
          {students.length ? (
            <AlertDialog>
              <AlertDialogTrigger
                render={<Button variant="destructive" size="sm" />}>
                Delete All
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Delete all students in this class?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This permanently removes every student from{' '}
                    {activeClass?.name ?? 'the selected class'}.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearStudents}>
                    Delete All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="px-6 xl:px-8 gap-5 xl:gap-6 text-base/relaxed flex flex-col lg:min-h-0">
        {students.length ? (
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain rounded-md border border-border/50 bg-background/20 p-2 pr-1 shadow-[inset_0_2px_10px_rgba(0,0,0,0.08)] dark:shadow-[inset_0_2px_10px_rgba(0,0,0,0.35)]">
            <div className="grid gap-3">
              {students.map((student) => {
                const isExcluded = student.status === 'excluded';
                return (
                  <div
                    key={student.id}
                    className="rounded-lg border border-border/60 bg-background/40 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="font-medium text-base/relaxed text-foreground truncate">
                          {formatStudentName(student.name)}
                        </span>
                        <span className="text-sm/relaxed text-muted-foreground/70">
                          Added{' '}
                          {new Date(student.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <Badge
                        className={cn(
                          'shrink-0 px-2.5 py-1 text-sm/relaxed shadow-sm',
                          isExcluded
                            ? 'bg-destructive/10 text-destructive border-destructive/50'
                            : 'bg-ctp-latte-green/10 text-ctp-latte-green border-ctp-latte-green/50',
                        )}>
                        {isExcluded ? 'Excluded' : 'Active'}
                      </Badge>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border/40 pt-3">
                      <label className="mr-auto flex min-h-[44px] items-center gap-2">
                        <Checkbox
                          checked={isExcluded}
                          onCheckedChange={() =>
                            handleToggleExcluded(student.id)
                          }
                          aria-label={`Mark ${student.name} as absent`}
                          className="touch-hitbox cursor-pointer border-accent/25"
                        />
                        <span className="text-sm/relaxed text-muted-foreground">
                          Absent
                        </span>
                      </label>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleOpenEdit(student.id)}
                        aria-label={`Edit ${formatStudentName(student.name)}`}
                        className="min-h-[44px] min-w-[44px]">
                        <PencilIcon className="size-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label={`Delete ${formatStudentName(student.name)}`}
                              className="min-h-[44px] min-w-[44px]"
                            />
                          }>
                          <Trash2Icon className="size-4 text-destructive" />
                          <span className="sr-only">Delete</span>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete {student.name}?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This removes the student from this class roster
                              and generator history.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteStudent(student.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-base text-muted-foreground">
            {activeClass
              ? 'Add students to start building this class roster.'
              : 'Create a class to start.'}
          </p>
        )}
      </CardContent>
      <AlertDialog
        open={!!editingStudentId}
        onOpenChange={(open) => {
          if (!open) handleCloseEdit();
        }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Edit student</AlertDialogTitle>
            <AlertDialogDescription>
              Update the student name or move them to another class.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Field>
            <FieldLabel htmlFor="edit-student-name">Student name</FieldLabel>
            <FieldContent>
              <Input
                id="edit-student-name"
                value={editName}
                onChange={(event) => {
                  setEditName(event.target.value);
                  if (editError) setEditError(null);
                }}
                placeholder="e.g. Alex Johnson"
              />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel htmlFor="edit-student-class">Class</FieldLabel>
            <FieldContent>
              <Select
                value={editClassId ?? ''}
                onValueChange={(value) => {
                  setEditClassId(value);
                  if (editError) setEditError(null);
                }}>
                <SelectTrigger id="edit-student-class">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {state.persisted.classes.map((entry) => (
                    <SelectItem key={entry.id} value={entry.id}>
                      {entry.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {editError ? <FieldError>{editError}</FieldError> : null}
            </FieldContent>
          </Field>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCloseEdit}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSaveEdit}
              disabled={!editingStudent}>
              Save Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
