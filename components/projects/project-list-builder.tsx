'use client';

import { formatStudentName } from '@/lib/students';

import { useMemo, useState } from 'react';

import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
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
  FieldDescription,
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

const DEFAULT_GROUP_SIZE = '3';

type GroupMode = 'none' | 'grouped';

export default function ProjectListBuilder() {
  const { state, actions } = useAppStore();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [projectType, setProjectType] = useState('');
  const [description, setDescription] = useState('');
  const [groupMode, setGroupMode] = useState<GroupMode>('none');
  const [groupSize, setGroupSize] = useState(DEFAULT_GROUP_SIZE);
  const [includeExcluded, setIncludeExcluded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const students = useMemo(
    () =>
      [...state.persisted.students].sort((a, b) =>
        a.name.localeCompare(b.name),
      ),
    [state.persisted.students],
  );

  const visibleStudents = useMemo(
    () =>
      includeExcluded
        ? students
        : students.filter((student) => student.status === 'active'),
    [includeExcluded, students],
  );

  const selectedCount = useMemo(
    () => visibleStudents.filter((s) => selectedIds.includes(s.id)).length,
    [visibleStudents, selectedIds],
  );

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((entry) => entry !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    setSelectedIds(visibleStudents.map((student) => student.id));
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  const handleCreateList = () => {
    const trimmedName = name.trim();
    const trimmedType = projectType.trim();
    if (!trimmedName || !trimmedType) {
      setError('Enter both a project name and project type.');
      return;
    }
    if (!selectedIds.length) {
      setError('Select at least one student to continue.');
      return;
    }

    const orderedSelectedIds = visibleStudents
      .filter((student) => selectedIds.includes(student.id))
      .map((student) => student.id);

    if (!orderedSelectedIds.length) {
      setError('Select at least one student to continue.');
      return;
    }

    const groups: string[][] = [];
    if (groupMode === 'grouped') {
      const size = Number.parseInt(groupSize, 10);
      if (!size || size < 2) {
        setError('Enter a group size of 2 or more.');
        return;
      }
      for (let index = 0; index < orderedSelectedIds.length; index += size) {
        groups.push(orderedSelectedIds.slice(index, index + size));
      }
    }

    actions.createProjectList(
      trimmedName,
      trimmedType,
      description,
      orderedSelectedIds,
      groups,
    );
    setName('');
    setProjectType('');
    setDescription('');
    setSelectedIds([]);
    setGroupMode('none');
    setGroupSize(DEFAULT_GROUP_SIZE);
    setError(null);
    setNotice('Project list saved.');
  };

  if (!state.ui.isHydrated) {
    return null;
  }

  return (
    <Card className="shadow-md py-6 xl:py-8 lg:gap-6 xl:gap-8">
      <CardHeader className="px-6 xl:px-8">
        <CardTitle className="text-xl">Create a project list</CardTitle>
        <CardDescription className="text-base/relaxed">
          Choose students from your roster and save them as a project-ready list
          or group set.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 px-6 xl:px-8 lg:gap-5 xl:gap-6 text-base/relaxed text-muted-foreground">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div className="flex flex-col gap-4">
            <Field>
              <FieldLabel htmlFor="project-name" className="text-lg/relaxed">
                Project name
              </FieldLabel>
              <FieldContent>
                <Input
                  id="project-name"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    if (error) setError(null);
                    if (notice) setNotice(null);
                  }}
                  placeholder="e.g. Ecosystem Posters"
                  className="text-base/relaxed h-9 placeholder:text-muted-foreground/70 placeholder:text-base/relaxed"
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="project-type" className="text-lg/relaxed">
                Project type
              </FieldLabel>
              <FieldContent>
                <Input
                  id="project-type"
                  value={projectType}
                  onChange={(event) => {
                    setProjectType(event.target.value);
                    if (error) setError(null);
                    if (notice) setNotice(null);
                  }}
                  placeholder="e.g. Presentation, Lab, Research"
                  className="text-base/relaxed h-9 placeholder:text-muted-foreground/70 placeholder:text-base/relaxed"
                />
                <FieldDescription className="text-base/relaxed text-muted-foreground/70">
                  Use a type to organize lists by assignment style.
                </FieldDescription>
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel
                htmlFor="project-description"
                className="text-lg/relaxed">
                Description
              </FieldLabel>
              <FieldContent>
                <Textarea
                  id="project-description"
                  value={description}
                  onChange={(event) => {
                    setDescription(event.target.value);
                    if (error) setError(null);
                    if (notice) setNotice(null);
                  }}
                  placeholder="Optional notes about the project or grouping."
                  className="text-base/relaxed  placeholder:text-muted-foreground/70 placeholder:text-base/relaxed"
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="grouping" className="text-lg/relaxed">
                Grouping
              </FieldLabel>
              <FieldContent>
                <Select
                  defaultValue="Individual list"
                  value={groupMode}
                  onValueChange={(value) => setGroupMode(value as GroupMode)}>
                  <SelectTrigger className="w-full text-base/relaxed h-9 placeholder:text-muted-foreground/70 placeholder:text-base/relaxed">
                    <SelectValue placeholder="Choose a grouping" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value="Individual list"
                      className="text-base/relaxed">
                      Individual list
                    </SelectItem>
                    <SelectItem
                      value="Create groups"
                      className="text-base/relaxed">
                      Create groups
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FieldDescription className="text-base/relaxed text-muted-foreground/70">
                  Build a list of individual students or auto-group them.
                </FieldDescription>
              </FieldContent>
            </Field>
            {groupMode === 'grouped' ? (
              <Field>
                <FieldLabel htmlFor="group-size">Group size</FieldLabel>
                <FieldContent>
                  <Input
                    id="group-size"
                    type="number"
                    min={2}
                    value={groupSize}
                    onChange={(event) => {
                      setGroupSize(event.target.value);
                      if (error) setError(null);
                      if (notice) setNotice(null);
                    }}
                    className="text-base/relaxed h-9 placeholder:text-muted-foreground/70 placeholder:text-base/relaxed"
                  />
                  <FieldDescription className="text-base/relaxed text-muted-foreground/70">
                    Groups will be created in alphabetical order based on the
                    students you select.
                  </FieldDescription>
                </FieldContent>
              </Field>
            ) : null}
          </div>
          <div className="flex flex-col gap-3 rounded-lg border border-dashed border-border/70 p-4">
            <div className="flex flex-col gap-1">
              <p className="text-lg/relaxed font-semibold">Selected students</p>
              <p className="text-base/relaxed text-muted-foreground">
                {selectedCount}
                {selectedCount === 1 ? ' student' : ' students'} selected.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={handleSelectAll}
                disabled={!visibleStudents.length}>
                Select all
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={handleClearSelection}
                disabled={!selectedIds.length}>
                Clear
              </Button>
              <Link
                href="/students"
                className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
                Add students
              </Link>
            </div>
            <FieldSeparator>Student roster</FieldSeparator>
            <div className="flex items-center gap-2">
              <Checkbox
                id="include-excluded"
                checked={includeExcluded}
                onCheckedChange={(checked) => {
                  setIncludeExcluded(Boolean(checked));
                }}
                className="touch-hitbox cursor-pointer border-accent/25"
              />
              <label
                htmlFor="include-excluded"
                className="text-base/relaxed text-muted-foreground">
                Include absent students
              </label>
            </div>
            <div className="max-h-64 overflow-y-auto pr-2">
              <div className="flex flex-col gap-2">
                {visibleStudents.length ? (
                  visibleStudents.map((student) => (
                    <label
                      key={student.id}
                      className="flex items-center gap-2 rounded-md border border-border/60 px-3 py-2 text-base/relaxed">
                      <Checkbox
                        checked={selectedIds.includes(student.id)}
                        onCheckedChange={() => toggleSelection(student.id)}
                        className="touch-hitbox cursor-pointer border-accent/25"
                      />
                      <span className="font-medium">
                        {formatStudentName(student.name)}
                      </span>
                      {student.status === 'excluded' ? (
                        <Badge variant="outline" className="text-xs">
                          Absent
                        </Badge>
                      ) : null}
                    </label>
                  ))
                ) : (
                  <p className="text-base/relaxed text-muted-foreground">
                    Add students to your roster to build project lists.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        {error ? <FieldError>{error}</FieldError> : null}
        {notice ? (
          <p className="text-base/relaxed text-muted-foreground">{notice}</p>
        ) : null}
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            onClick={handleCreateList}
            className="h-9 font-semibold text-base">
            Save Project List
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
