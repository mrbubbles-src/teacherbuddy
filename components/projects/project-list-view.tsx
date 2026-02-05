'use client';

import { formatStudentName } from '@/lib/students';
import { cn } from '@/lib/utils';

import { useMemo, useState } from 'react';

import { useTheme } from 'next-themes';

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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAppStore } from '@/context/app-store';

export default function ProjectListView() {
  const { theme } = useTheme();
  const { state, actions } = useAppStore();
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState('');
  const [draftType, setDraftType] = useState('');
  const [draftDescription, setDraftDescription] = useState('');
  const [draftSelectedIds, setDraftSelectedIds] = useState<string[]>([]);
  const [draftGroups, setDraftGroups] = useState<string[][]>([]);
  const [includeExcluded, setIncludeExcluded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const projectLists = useMemo(
    () =>
      [...state.persisted.projectLists].sort(
        (a, b) => b.createdAt - a.createdAt,
      ),
    [state.persisted.projectLists],
  );

  const studentMap = useMemo(() => {
    return new Map(
      state.persisted.students.map((student) => [student.id, student]),
    );
  }, [state.persisted.students]);

  const sortedStudents = useMemo(
    () =>
      [...state.persisted.students].sort((a, b) =>
        a.name.localeCompare(b.name),
      ),
    [state.persisted.students],
  );

  const visibleStudents = useMemo(
    () =>
      includeExcluded
        ? sortedStudents
        : sortedStudents.filter((student) => student.status === 'active'),
    [includeExcluded, sortedStudents],
  );

  const startEditingList = (listId: string) => {
    const list = projectLists.find((entry) => entry.id === listId);
    if (!list) return;
    setEditingListId(listId);
    setDraftName(list.name);
    setDraftType(list.projectType);
    setDraftDescription(list.description);
    setDraftSelectedIds(list.studentIds);
    setDraftGroups(list.groups.map((group) => [...group]));
    setIncludeExcluded(false);
    setError(null);
  };

  const cancelEditing = () => {
    setEditingListId(null);
    setDraftName('');
    setDraftType('');
    setDraftDescription('');
    setDraftSelectedIds([]);
    setDraftGroups([]);
    setIncludeExcluded(false);
    setError(null);
  };

  const removeStudentFromDraft = (studentId: string) => {
    setDraftSelectedIds((prev) => prev.filter((id) => id !== studentId));
    setDraftGroups((prev) =>
      prev.map((group) => group.filter((id) => id !== studentId)),
    );
  };

  const addStudentToDraft = (studentId: string) => {
    setDraftSelectedIds((prev) =>
      prev.includes(studentId) ? prev : [...prev, studentId],
    );
    setDraftGroups((prev) => {
      if (!prev.length) return [[studentId]];
      return prev.map((group, index) =>
        index === prev.length - 1 ? [...group, studentId] : group,
      );
    });
  };

  const moveStudentToGroup = (studentId: string, nextGroupIndex: number) => {
    setDraftGroups((prev) => {
      const nextGroups = prev.map((group) =>
        group.filter((id) => id !== studentId),
      );
      if (!nextGroups[nextGroupIndex]) {
        return prev;
      }
      nextGroups[nextGroupIndex] = [...nextGroups[nextGroupIndex], studentId];
      return nextGroups;
    });
  };

  const handleSaveList = (listId: string) => {
    const list = projectLists.find((entry) => entry.id === listId);
    if (!list) return;
    const trimmedName = draftName.trim();
    const trimmedType = draftType.trim();
    if (!trimmedName || !trimmedType) {
      setError('Enter both a project name and project type.');
      return;
    }
    if (!draftSelectedIds.length) {
      setError('Select at least one student to continue.');
      return;
    }
    const updatedStudentIds = list.groups.length
      ? draftGroups.flat()
      : draftSelectedIds;
    const updatedGroups = list.groups.length ? draftGroups : [];
    actions.updateProjectList(
      list.id,
      trimmedName,
      trimmedType,
      draftDescription,
      updatedStudentIds,
      updatedGroups,
    );
    cancelEditing();
  };

  if (!state.ui.isHydrated) {
    return null;
  }

  if (!projectLists.length) {
    return (
      <Card className="shadow-md py-6 xl:py-8 lg:gap-6 xl:gap-8">
        <CardHeader className="px-6 xl:px-8">
          <CardTitle className="text-xl">Saved project lists</CardTitle>
        </CardHeader>
        <CardContent className="px-6 xl:px-8 text-base/relaxed text-muted-foreground">
          <p className="text-sm">Your saved project lists will appear here.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {projectLists.map((list) => {
        const createdAt = new Date(list.createdAt).toLocaleDateString();
        const isEditing = editingListId === list.id;
        const isGroupedList = list.groups.length > 0;
        const groupsToRender = isEditing ? draftGroups : list.groups;
        const selectedIds = isEditing ? draftSelectedIds : list.studentIds;
        const availableStudents = visibleStudents.filter(
          (student) => !selectedIds.includes(student.id),
        );
        return (
          <Card
            key={list.id}
            className="shadow-md py-6 xl:py-8 lg:gap-6 xl:gap-8">
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between px-6 xl:px-8">
              <div className="flex flex-col gap-1">
                <CardTitle className="text-xl">{list.name}</CardTitle>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <span>{createdAt}</span>
                  <span aria-hidden="true">•</span>
                  <span>{list.projectType}</span>
                  {isGroupedList ? (
                    <Badge
                      variant="outline"
                      className="p-2.5 text-sm border-accent/50 shadow-sm">
                      Grouped
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="p-2.5 text-sm border-accent/50 shadow-sm">
                      Individual list
                    </Badge>
                  )}
                </div>
                {list.description ? (
                  <p className="text-sm text-muted-foreground">
                    {list.description}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-2">
                {isEditing ? (
                  <>
                    <Button
                      size="sm"
                      className={cn(
                        theme === 'dark'
                          ? 'bg-ctp-mocha-green text-ctp-mocha-base'
                          : 'bg-ctp-latte-green text-ctp-latte-base',
                      )}
                      onClick={() => handleSaveList(list.id)}>
                      Save changes
                    </Button>
                    <Button size="sm" variant="ghost" onClick={cancelEditing}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => startEditingList(list.id)}>
                    Edit list
                  </Button>
                )}
                <AlertDialog>
                  <AlertDialogTrigger
                    render={<Button variant="destructive" size="sm" />}>
                    Delete
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Delete this project list?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This removes the list from your saved projects.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => actions.deleteProjectList(list.id)}>
                        Delete List
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 px-6 xl:px-8 lg:gap-5 xl:gap-6 text-base/relaxed text-muted-foreground">
              {isEditing ? (
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
                  <div className="flex flex-col gap-4">
                    <Field>
                      <FieldLabel htmlFor={`edit-name-${list.id}`}>
                        Project name
                      </FieldLabel>
                      <FieldContent>
                        <Input
                          id={`edit-name-${list.id}`}
                          value={draftName}
                          onChange={(event) => {
                            setDraftName(event.target.value);
                            if (error) setError(null);
                          }}
                        />
                      </FieldContent>
                    </Field>
                    <Field>
                      <FieldLabel htmlFor={`edit-type-${list.id}`}>
                        Project type
                      </FieldLabel>
                      <FieldContent>
                        <Input
                          id={`edit-type-${list.id}`}
                          value={draftType}
                          onChange={(event) => {
                            setDraftType(event.target.value);
                            if (error) setError(null);
                          }}
                        />
                      </FieldContent>
                    </Field>
                    <Field>
                      <FieldLabel htmlFor={`edit-description-${list.id}`}>
                        Description
                      </FieldLabel>
                      <FieldContent>
                        <Textarea
                          id={`edit-description-${list.id}`}
                          value={draftDescription}
                          onChange={(event) => {
                            setDraftDescription(event.target.value);
                          }}
                        />
                      </FieldContent>
                    </Field>
                    {error ? <FieldError>{error}</FieldError> : null}
                  </div>
                  <div className="flex flex-col gap-3 rounded-lg border border-dashed border-border/70 p-4">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-semibold">Selected students</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedIds.length}
                        {selectedIds.length === 1
                          ? ' student'
                          : ' students'}{' '}
                        selected.
                      </p>
                    </div>
                    <FieldSeparator>Student roster</FieldSeparator>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`include-excluded-${list.id}`}
                        checked={includeExcluded}
                        onCheckedChange={(checked) => {
                          setIncludeExcluded(Boolean(checked));
                        }}
                      />
                      <label
                        htmlFor={`include-excluded-${list.id}`}
                        className="text-sm text-muted-foreground">
                        Include absent students
                      </label>
                    </div>
                    <div className="max-h-64 overflow-y-auto pr-2">
                      <div className="flex flex-col gap-2">
                        {availableStudents.length ? (
                          availableStudents.map((student) => (
                            <label
                              key={student.id}
                              className="flex items-center justify-between gap-2 rounded-md border border-border/60 px-3 py-2 text-sm">
                              <span className="font-medium">
                                {formatStudentName(student.name)}
                              </span>
                              <Button
                                type="button"
                                size="sm"
                                variant="secondary"
                                onClick={() => addStudentToDraft(student.id)}>
                                Add
                              </Button>
                            </label>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Everyone is already included in this list.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
              {isGroupedList ? (
                <div className="grid gap-3 md:grid-cols-2">
                  {groupsToRender.map((group, index) => (
                    <div
                      key={`${list.id}-group-${index + 1}`}
                      className="rounded-lg border border-border/60 p-3">
                      <p className="text-sm font-semibold text-muted-foreground">
                        Group {index + 1}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {group.length ? (
                          group.map((studentId) => {
                            const student = studentMap.get(studentId);
                            if (!student) return null;
                            if (isEditing) {
                              return (
                                <div
                                  key={studentId}
                                  className="flex items-center gap-2 rounded-md border border-border/60 px-2 py-1 text-sm">
                                  <span className="font-medium">
                                    {formatStudentName(student.name)}
                                  </span>
                                  <Select
                                    value={`${index}`}
                                    onValueChange={(value) => {
                                      if (value == null) return;
                                      moveStudentToGroup(
                                        studentId,
                                        Number.parseInt(value, 10),
                                      );
                                    }}>
                                    <SelectTrigger className="w-28">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {groupsToRender.map((_, groupIndex) => (
                                        <SelectItem
                                          key={`${list.id}-group-${groupIndex + 1}`}
                                          value={`${groupIndex}`}>
                                          Group {groupIndex + 1}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    className="text-destructive hover:text-destructive/80"
                                    onClick={() =>
                                      removeStudentFromDraft(studentId)
                                    }>
                                    Remove
                                  </Button>
                                </div>
                              );
                            }
                            return (
                              <Badge
                                key={studentId}
                                variant="default"
                                className="p-2.5 text-sm border-card/50 shadow-sm">
                                {formatStudentName(student.name)}
                              </Badge>
                            );
                          })
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No students assigned.
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selectedIds.map((studentId) => {
                    const student = studentMap.get(studentId);
                    if (!student) return null;
                    if (isEditing) {
                      return (
                        <div
                          key={studentId}
                          className="flex items-center gap-2 rounded-md border border-border/60 px-2 py-1 text-sm">
                          <span className="font-medium">
                            {formatStudentName(student.name)}
                          </span>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive/80"
                            onClick={() => removeStudentFromDraft(studentId)}>
                            Remove
                          </Button>
                        </div>
                      );
                    }
                    return (
                      <Badge
                        key={studentId}
                        variant="default"
                        className="p-2.5 text-sm border-card/50 shadow-sm">
                        {formatStudentName(student.name)}
                      </Badge>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
