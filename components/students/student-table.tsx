'use client';

import {
  formatStudentName,
  normalizeStudentName,
  studentNameKey,
} from '@/lib/students';
import { cn } from '@/lib/utils';

import { useMemo, useState } from 'react';

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
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAppStore } from '@/context/app-store';

/**
 * Student roster table. Shows server-rendered skeleton until hydrated.
 * Skeleton is passed from the page (RSC) so it runs as a server component.
 */
export default function StudentTable({
  skeleton,
}: {
  skeleton: React.ReactNode;
}) {
  const { state, actions } = useAppStore();
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editError, setEditError] = useState<string | null>(null);

  const students = useMemo(
    () =>
      [...state.persisted.students].sort((a, b) =>
        a.name.localeCompare(b.name),
      ),
    [state.persisted.students],
  );

  const activeCount = students.filter(
    (student) => student.status === 'active',
  ).length;

  const editingStudent = editingStudentId
    ? (state.persisted.students.find(
        (student) => student.id === editingStudentId,
      ) ?? null)
    : null;

  const handleOpenEdit = (studentId: string) => {
    const student = state.persisted.students.find(
      (item) => item.id === studentId,
    );
    if (!student) return;
    setEditingStudentId(student.id);
    setEditName(student.name);
    setEditError(null);
  };

  const handleCloseEdit = () => {
    setEditingStudentId(null);
    setEditName('');
    setEditError(null);
  };

  const handleSaveEdit = () => {
    const normalized = normalizeStudentName(editName);
    if (!normalized) {
      setEditError('Enter a student name to continue.');
      return;
    }
    const nextKey = studentNameKey(normalized);
    const hasDuplicate = state.persisted.students.some(
      (student) =>
        student.id !== editingStudentId &&
        studentNameKey(student.name) === nextKey,
    );
    if (hasDuplicate) {
      setEditError('That student already exists. Try a different name.');
      return;
    }
    if (editingStudentId) {
      actions.updateStudent(editingStudentId, normalized);
    }
    handleCloseEdit();
  };

  if (!state.ui.isHydrated) {
    return <>{skeleton}</>;
  }

  return (
    <Card className="shadow-md py-6 xl:py-8 lg:gap-6 xl:gap-8">
      <CardHeader className="px-6 xl:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <CardTitle className="text-xl">Student List</CardTitle>
            <CardDescription className="text-base/relaxed">
              {students.length
                ? `${activeCount} active · ${
                    students.length - activeCount
                  } excluded`
                : 'Your roster will appear here once students are added.'}
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
                  <AlertDialogTitle>Delete all students?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently remove every student from the roster.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={actions.clearStudents}>
                    Delete All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="px-6 xl:px-8 gap-5 xl:gap-6 text-base/relaxed flex flex-col">
        {students.length ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-lg/relaxed px-4 sm:px-3 md:px-2">
                  Student
                </TableHead>
                <TableHead className="text-lg/relaxed px-4 sm:px-3 md:px-2">
                  Status
                </TableHead>
                <TableHead className="text-lg/relaxed text-right px-4 sm:px-3 md:px-2">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => {
                const isExcluded = student.status === 'excluded';
                return (
                  <TableRow key={student.id}>
                    <TableCell className="px-4 sm:px-3 md:px-2">
                      <div className="flex flex-col">
                        <span className="font-medium text-base/relaxed md:text-lg/relaxed">
                          {formatStudentName(student.name)}
                        </span>
                        <span className="text-sm/relaxed md:text-base/relaxed text-muted-foreground/70">
                          Added{' '}
                          {new Date(student.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 sm:px-3 md:px-2">
                      <Badge
                        className={cn(
                          'p-2.5 text-base/relaxed shadow-sm',
                          isExcluded
                            ? 'bg-destructive/10 text-destructive border-destructive/50'
                            : 'bg-ctp-latte-green/10 text-ctp-latte-green border-ctp-latte-green/50',
                        )}>
                        {isExcluded ? 'Excluded' : 'Active'}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 sm:px-3 md:px-2">
                      <div className="flex items-center justify-end gap-3">
                        <div className="flex items-center gap-2">
                          <Label className="text-sm/relaxed md:text-base/relaxed">
                            Absent
                          </Label>
                          <Checkbox
                            checked={isExcluded}
                            onCheckedChange={() =>
                              actions.toggleStudentExcluded(student.id)
                            }
                            aria-label={`Mark ${student.name} as absent`}
                            className="touch-hitbox cursor-pointer border-accent/25"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEdit(student.id)}
                          className="md:text-base/relaxed text-sm/relaxed">
                          Edit
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger
                            render={
                              <Button
                                variant="destructive"
                                size="sm"
                                className="md:text-base/relaxed text-sm/relaxed"
                              />
                            }>
                            Delete
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete {student.name}?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This removes the student from the roster and
                                generator history.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  actions.deleteStudent(student.id)
                                }>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <p className="text-base text-muted-foreground">
            Add students to start building your roster.
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
              Update the student name. Generator history is preserved.
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
